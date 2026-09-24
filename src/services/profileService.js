import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * Service for managing user profiles and role-specific tables
 * Schema:
 * - profiles (id, full_name, role, contact_number, created_at)
 * - supplier_profiles (user_id, farm_or_coop_name, barangay)
 * - buyer_profiles (user_id, business_name, business_type)
 */

export const profileService = {
  /**
   * Fetch complete profile including role-specific details
   */
  async getProfile(userId) {
    if (!isSupabaseConfigured || !userId) {
      return { data: null, error: new Error('Supabase is not configured or userId is missing') };
    }

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle to avoid throwing on no rows

      if (profileError) throw profileError;
      if (!profile) return { data: null, error: null };

      // Fetch role-specific profile
      let roleData = null;
      if (profile.role === 'supplier') {
        const { data: supplierData } = await supabase
          .from('supplier_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        roleData = supplierData;
      } else if (profile.role === 'buyer') {
        const { data: buyerData } = await supabase
          .from('buyer_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        roleData = buyerData;
      }

      return {
        data: {
          ...profile,
          roleDetails: roleData
        },
        error: null
      };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Create base profile and role profile upon registration
   */
  async createProfile({ userId, fullName, role, contactNumber, roleDetails = {} }) {
    if (!isSupabaseConfigured || !userId) {
      return { error: new Error('Supabase is not configured or userId is missing') };
    }

    try {
      // 1. Insert into profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: fullName,
          role,
          contact_number: contactNumber,
          created_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // 2. Insert into role-specific table
      if (role === 'supplier') {
        const { error: supplierError } = await supabase
          .from('supplier_profiles')
          .insert({
            user_id: userId,
            farm_or_coop_name: roleDetails.farmOrCoopName || `${fullName}'s Farm/Coop`,
            barangay: roleDetails.barangay || 'Bukidnon'
          });
        if (supplierError) throw supplierError;
      } else if (role === 'buyer') {
        const { error: buyerError } = await supabase
          .from('buyer_profiles')
          .insert({
            user_id: userId,
            business_name: roleDetails.businessName || `${fullName}'s Enterprise`,
            business_type: roleDetails.businessType || 'other'
          });
        if (buyerError) throw buyerError;
      }

      return { error: null };
    } catch (err) {
      return { error: err };
    }
  },

  /**
   * Update base profile information
   */
  async updateProfile(userId, updates) {
    if (!isSupabaseConfigured) return { error: new Error('Supabase is not configured') };
    return await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
  }
};

