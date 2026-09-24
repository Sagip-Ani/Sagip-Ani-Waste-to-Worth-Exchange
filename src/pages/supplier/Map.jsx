import { useEffect, useState } from 'react';
import SupplierNavbar from '../../components/supplier/SupplierNavbar';
import Map, { parseLocation } from '../../components/Map';
import { supabase } from '../../lib/supabaseClient';

export default function SupplierMap() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) { setError('Please log in to view the buyer map.'); setLoading(false); return; }
      
      console.log('[Supplier Map] Loading for user:', authData.user.id);
      
      try {
        // Simple approach: Get matches with basic fields, then fetch related data separately
        const { data: matchData, error: matchError } = await supabase
          .from('matches')
          .select('id, score, distance_km, demand_id, listing_id')
          .order('score', { ascending: false });
        
        console.log('[Supplier Map] Simple match data:', matchData, 'Error:', matchError);
        
        if (matchError) throw matchError;
        
        if (!matchData || matchData.length === 0) {
          console.log('[Supplier Map] No matches found');
          setLoading(false);
          return;
        }
        
        // Get user's listings to filter relevant matches
        const { data: userListings } = await supabase
          .from('material_listings')
          .select('id, material_type, quantity_kg')
          .eq('supplier_id', authData.user.id);
        
        console.log('[Supplier Map] User listings:', userListings);
        
        const userListingIds = userListings?.map(l => l.id) || [];
        const relevantMatches = matchData.filter(m => userListingIds.includes(m.listing_id));
        
        console.log('[Supplier Map] Relevant matches:', relevantMatches);
        
        if (relevantMatches.length === 0) {
          console.log('[Supplier Map] No relevant matches found');
          setLoading(false);
          return;
        }
        
        // Get supplier listing locations
        const { data: supplierListings } = await supabase
          .from('material_listing_map_points')
          .select('id, latitude, longitude')
          .in('id', userListingIds);
        
        console.log('[Supplier Map] Supplier listing locations:', supplierListings);
        
        if (supplierListings && supplierListings.length > 0) {
          // Create points based on supplier listing locations (temporary workaround)
          const points = relevantMatches.map((match) => {
            const listingLocation = supplierListings.find(l => l.id === match.listing_id);
            const listing = userListings?.find(l => l.id === match.listing_id);
            
            return listingLocation ? {
              lat: listingLocation.latitude + 0.01, // Slightly offset to show as different location
              lng: listingLocation.longitude + 0.01,
              role: 'buyer',
              material_type: listing?.material_type || 'Material',
              quantity: listing?.quantity_kg || 0,
              distance_km: match.distance_km,
              label: `Match score: ${formatScore(match.score)}`
            } : null;
          }).filter(Boolean);
          
          console.log('[Supplier Map] Final points (temporary workaround):', points);
          setPoints(points);
        } else {
          console.log('[Supplier Map] No supplier locations found');
          setPoints([]);
        }
      } catch (err) {
        console.error('[Supplier Map] Error:', err);
        setError(err.message);
      }
      
      setLoading(false);
    }
    load();
  }, []);

  return <div className="min-h-screen bg-white"><SupplierNavbar /><main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"><div className="mb-7"><div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-2">Buyer Map</div><h1 className="text-3xl font-extrabold text-[#143d2b]">Matched Buyers</h1><p className="text-sm text-gray-500 mt-1">Blue pins represent buyers from your matched demand posts.</p></div>{error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}{loading ? <div className="h-[520px] flex items-center justify-center text-gray-400 border border-gray-200 rounded-2xl">Loading buyer locations...</div> : <Map points={points} height="600px" />}</main></div>;
}
function formatScore(score) { const value = Number(score); if (!Number.isFinite(value)) return '—'; return value <= 1 ? `${Math.round(value * 100)}%` : `${Math.round(value)}`; }
