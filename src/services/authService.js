import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { profileService } from './profileService';

export const authService = {
  /**
   * Register a new user with Supabase Auth and initialize profile tables
   */
  async signUp({ fullName, email, phone, password, role, roleDetails = {} }) {
    if (!isSupabaseConfigured) {
      return {
        data: null,
        error: new Error('Supabase authentication is not configured yet. Please configure your .env file with VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.')
      };
    }

    try {
      // 1. Supabase Auth signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            contact_number: phone.trim(),
            role
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Registration failed. No user was returned by authentication service.');

      // 2. Insert into profiles & role-specific profiles
      const { error: profileError } = await profileService.createProfile({
        userId: authData.user.id,
        fullName: fullName.trim(),
        role,
        contactNumber: phone.trim(),
        roleDetails
      });

      if (profileError) {
        console.warn('[Sagip-Ani] Profile record creation warning:', profileError);
        // Do not crash registration if auth succeeded; auth record is established
      }

      return { data: authData, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Sign in using email and password
   */
  async signInWithEmail({ email, password }) {
    if (!isSupabaseConfigured) {
      return {
        data: null,
        profile: null,
        error: new Error('Supabase authentication is not configured yet. Please configure your .env file with VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.')
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) throw error;

      // Retrieve profile & determine role
      let profile = null;
      if (data?.user?.id) {
        const profileRes = await profileService.getProfile(data.user.id);
        
        if (profileRes.error) {
          console.warn('[Sagip-Ani] Error fetching profile:', profileRes.error);
        }
        
        profile = profileRes.data;
        
        // If profile doesn't exist, create a default one based on user metadata
        if (!profile) {
          console.log('[Sagip-Ani] Profile not found, attempting to create from user metadata');
          const userRole = data.user.user_metadata?.role || 'supplier'; // Default to supplier
          const fullName = data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User';
          const contactNumber = data.user.user_metadata?.contact_number || '';
          
          const createRes = await profileService.createProfile({
            userId: data.user.id,
            fullName,
            role: userRole,
            contactNumber,
            roleDetails: {}
          });
          
          if (!createRes.error) {
            // Fetch the newly created profile
            const newProfileRes = await profileService.getProfile(data.user.id);
            profile = newProfileRes.data;
            console.log('[Sagip-Ani] Profile created successfully:', profile?.role);
          } else {
            console.error('[Sagip-Ani] Failed to create profile:', createRes.error);
          }
        }
      }

      return { data, profile, error: null };
    } catch (err) {
      return { data: null, profile: null, error: err };
    }
  },

  /**
   * Initiate Google OAuth flow via Supabase
   */
  async signInWithGoogle() {
    if (!isSupabaseConfigured) {
      return {
        error: new Error('Google OAuth is not configured yet. Please ensure Supabase credentials and Google OAuth provider are enabled in your Supabase dashboard.')
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/login`
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Sign out current user session
   */
  async signOut() {
    if (!isSupabaseConfigured) return { error: null };
    return await supabase.auth.signOut();
  },

  /**
   * Retrieve currently authenticated user session and profile
   */
  async getCurrentUser() {
    if (!isSupabaseConfigured) return { user: null, profile: null };

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return { user: null, profile: null };

      const { data: profile } = await profileService.getProfile(user.id);
      return { user, profile };
    } catch {
      return { user: null, profile: null };
    }
  },

  /**
   * Session state listener
   */
  onAuthStateChange(callback) {
    if (!isSupabaseConfigured) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(callback);
  }
};

