import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * Service for creating and managing matches between buyer demands and supplier listings
 * This is primarily for testing purposes until the automated matching engine is implemented
 */
export const matchService = {
  /**
   * Create a manual match between a buyer demand and supplier listing
   * This is for testing the matching functionality
   */
  async createMatch({ demandId, listingId, score = 0.95, distanceKm = 10.5 }) {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured') };
    }

    try {
      const { data, error } = await supabase
        .from('matches')
        .insert({
          demand_id: demandId,
          listing_id: listingId,
          score: score,
          distance_km: distanceKm
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Get all matches for the current user (as buyer or supplier)
   */
  async getMyMatches() {
    if (!isSupabaseConfigured) return { data: [], error: null };

    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) return { data: [], error: new Error('Not authenticated') };

      const { data, error } = await supabase
        .from('matches')
        .select(`
          id, score, distance_km, created_at,
          material_listings!inner (id, material_type, quantity_kg, location, supplier_id),
          buyer_demands!inner (id, material_type, quantity_needed_kg, max_distance_km, buyer_id)
        `)
        .or(`buyer_demands.buyer_id.eq.${authData.user.id},material_listings.supplier_id.eq.${authData.user.id}`)
        .order('score', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      return { data: [], error: err };
    }
  }
};