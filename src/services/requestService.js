import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * Service for requests table
 * RLS: alter table requests enable row level security;
 */
export const requestService = {
  async getMyRequests() {
    if (!isSupabaseConfigured) return { data: [], error: null };
    return await supabase
      .from('requests')
      .select(`
        id,
        status,
        created_at,
        initiated_by,
        match:match_id (
          id,
          score,
          distance_km,
          listing:listing_id (id, material_type, quantity_kg, supplier_id),
          demand:demand_id (id, material_type, quantity_needed_kg, buyer_id)
        )
      `)
      .order('created_at', { ascending: false });
  },

  async createRequest(matchId) {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured') };
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be signed in to create a request.');

    return await supabase
      .from('requests')
      .insert({
        match_id: matchId,
        initiated_by: user.id,
        status: 'pending'
      })
      .select()
      .single();
  },

  async updateRequestStatus(requestId, status) {
    if (!isSupabaseConfigured) return { data: null, error: null };
    return await supabase
      .from('requests')
      .update({ status })
      .eq('id', requestId);
  }
};

