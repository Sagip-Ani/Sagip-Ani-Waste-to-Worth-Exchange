import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * Service for buyer_demands table
 * RLS: auth.uid() = buyer_id
 */
export const demandService = {
  async getMyDemands() {
    if (!isSupabaseConfigured) return { data: [], error: null };
    return await supabase
      .from('buyer_demands')
      .select('*')
      .order('created_at', { ascending: false });
  },

  async createDemand({ materialType, quantityNeededKg, location, maxDistanceKm }) {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured') };
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be signed in to create a buyer demand.');

    // Ensure location is a valid PostGIS point string
    const pointLocation = typeof location === 'string'
      ? location
      : `POINT(${location.lng} ${location.lat})`;

    return await supabase
      .from('buyer_demands')
      .insert({
        buyer_id: user.id,
        material_type: materialType,
        quantity_needed_kg: quantityNeededKg,
        location: pointLocation,
        max_distance_km: maxDistanceKm
      })
      .select()
      .single();
  },

  async updateDemand(id, updates) {
    if (!isSupabaseConfigured) return { data: null, error: null };
    
    // Convert location if provided as object
    if (updates.location && typeof updates.location === 'object') {
      updates.location = `POINT(${updates.location.lng} ${updates.location.lat})`;
    }
    
    return await supabase
      .from('buyer_demands')
      .update(updates)
      .eq('id', id);
  },

  async deleteDemand(id) {
    if (!isSupabaseConfigured) return { error: null };
    
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { error: new Error('Not authenticated') };

    return await supabase
      .from('buyer_demands')
      .delete()
      .eq('id', id)
      .eq('buyer_id', authData.user.id);
  },

  /**
   * Get a single demand by ID
   */
  async getDemandById(id) {
    if (!isSupabaseConfigured) return { data: null, error: new Error('Supabase is not configured') };

    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { data: null, error: new Error('Not authenticated') };

    return await supabase
      .from('buyer_demands')
      .select('*')
      .eq('id', id)
      .eq('buyer_id', authData.user.id)
      .single();
  },

  /**
   * Update an existing demand
   */
  async updateDemand(id, updates) {
    if (!isSupabaseConfigured) return { data: null, error: new Error('Supabase is not configured') };

    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { data: null, error: new Error('Not authenticated') };

    // Convert location if provided as object
    const finalUpdates = { ...updates };
    if (updates.location && typeof updates.location === 'object') {
      finalUpdates.location = `POINT(${updates.location.lng} ${updates.location.lat})`;
    }

    return await supabase
      .from('buyer_demands')
      .update(finalUpdates)
      .eq('id', id)
      .eq('buyer_id', authData.user.id)
      .select()
      .single();
  },

  /**
   * Update demand status
   */
  async updateDemandStatus(id, status) {
    return this.updateDemand(id, { status });
  }
};

