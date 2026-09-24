import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * Service for material_listings table
 * RLS: auth.uid() = supplier_id
 */
export const listingService = {
  async getMyListings() {
    if (!isSupabaseConfigured) return { data: [], error: null };
    return await supabase
      .from('material_listings')
      .select('*')
      .order('created_at', { ascending: false });
  },

  async createListing({ materialType, quantityKg, location, availableFrom, availableUntil }) {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured') };
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be signed in to create a listing.');

    // Ensure location is a valid PostGIS point string
    const pointLocation = typeof location === 'string' 
      ? location 
      : `POINT(${location.lng} ${location.lat})`;

    return await supabase
      .from('material_listings')
      .insert({
        supplier_id: user.id,
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

  async updateListing(id, updates) {
    if (!isSupabaseConfigured) return { data: null, error: null };
    
    // Convert location if provided as object
    if (updates.location && typeof updates.location === 'object') {
      updates.location = `POINT(${updates.location.lng} ${updates.location.lat})`;
    }
    
    return await supabase
      .from('material_listings')
      .update(updates)
      .eq('id', id);
  },

  async deleteListing(id) {
    if (!isSupabaseConfigured) return { error: null };
    return await supabase
      .from('material_listings')
      .delete()
      .eq('id', id);
  }
};

