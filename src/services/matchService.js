import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * Service for matches table
 * RLS: read own matches
 */
export const matchService = {
  async getMyMatches() {
    if (!isSupabaseConfigured) return { data: [], error: null };
    return await supabase
      .from('matches')
      .select(`
        id,
        score,
        distance_km,
        created_at,
        listing:listing_id (*),
        demand:demand_id (*)
      `)
      .order('created_at', { ascending: false });
  },

  async getMatchById(id) {
    if (!isSupabaseConfigured) return { data: null, error: null };
    return await supabase
      .from('matches')
      .select(`
        id,
        score,
        distance_km,
        created_at,
        listing:listing_id (*),
        demand:demand_id (*)
      `)
      .eq('id', id)
      .single();
  }
};

