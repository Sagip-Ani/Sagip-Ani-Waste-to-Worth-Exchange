import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * Service for supplier material listings CRUD operations
 */
export const listingService = {
  /**
   * Get all listings for the current supplier
   */
  async getMyListings() {
    if (!isSupabaseConfigured) return { data: [], error: null };
    
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { data: [], error: new Error('Not authenticated') };

    return await supabase
      .from('material_listings')
      .select('*')
      .eq('supplier_id', authData.user.id)
      .order('created_at', { ascending: false });
  },

  /**
   * Get a single listing by ID
   */
  async getListingById(id) {
    if (!isSupabaseConfigured) return { data: null, error: new Error('Supabase is not configured') };

    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { data: null, error: new Error('Not authenticated') };

    return await supabase
      .from('material_listings')
      .select('*')
      .eq('id', id)
      .eq('supplier_id', authData.user.id)
      .single();
  },

  /**
   * Create a new listing
   */
  async createListing({ materialType, quantityKg, location, availableFrom, availableUntil }) {
    if (!isSupabaseConfigured) return { data: null, error: new Error('Supabase is not configured') };

    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { data: null, error: new Error('Not authenticated') };

    const pointLocation = typeof location === 'string'
      ? location
      : `POINT(${location.lng} ${location.lat})`;

    return await supabase
      .from('material_listings')
      .insert({
        supplier_id: authData.user.id,
        material_type: materialType,
        quantity_kg: quantityKg,
        location: pointLocation,
        available_from: availableFrom,
        available_until: availableUntil,
        status: 'listed'
      })
      .select()
      .single();
  },

  /**
   * Update an existing listing
   */
  async updateListing(id, updates) {
    if (!isSupabaseConfigured) return { data: null, error: new Error('Supabase is not configured') };

    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { data: null, error: new Error('Not authenticated') };

    // Convert location if provided as object
    const finalUpdates = { ...updates };
    if (updates.location && typeof updates.location === 'object') {
      finalUpdates.location = `POINT(${updates.location.lng} ${updates.location.lat})`;
    }

    return await supabase
      .from('material_listings')
      .update(finalUpdates)
      .eq('id', id)
      .eq('supplier_id', authData.user.id)
      .select()
      .single();
  },

  /**
   * Delete a listing
   */
  async deleteListing(id) {
    if (!isSupabaseConfigured) return { error: new Error('Supabase is not configured') };

    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { error: new Error('Not authenticated') };

    return await supabase
      .from('material_listings')
      .delete()
      .eq('id', id)
      .eq('supplier_id', authData.user.id);
  },

  /**
   * Update listing status
   */
  async updateListingStatus(id, status) {
    return this.updateListing(id, { status });
  }
};