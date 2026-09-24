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
        listing:listing_id (id, material_type, quantity_kg, supplier_id),
        demand:demand_id (id, material_type, quantity_needed_kg, max_distance_km)
      `)
      .order('created_at', { ascending: false });
  },

  async getMatchesForSupplier(supplierId) {
    if (!isSupabaseConfigured) return { data: [], error: null };
    return await supabase
      .from('matches')
      .select(`
        id,
        score,
        distance_km,
        created_at,
        listing:listing_id (id, material_type, quantity_kg, supplier_id),
        demand:demand_id (id, material_type, quantity_needed_kg, max_distance_km, buyer_id)
      `)
      .eq('listing.supplier_id', supplierId)
      .order('score', { ascending: false });
  },

  async getMatchesForBuyer(buyerId, demandId = null) {
    if (!isSupabaseConfigured) return { data: [], error: null };
    let query = supabase
      .from('matches')
      .select(`
        id,
        score,
        distance_km,
        created_at,
        listing:listing_id (id, material_type, quantity_kg, location, supplier_id),
        demand:demand_id (id, material_type, quantity_needed_kg, max_distance_km, buyer_id)
      `)
      .eq('demand.buyer_id', buyerId)
      .order('score', { ascending: false });

    if (demandId) {
      query = query.eq('demand.id', demandId);
    }

    return await query;
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

