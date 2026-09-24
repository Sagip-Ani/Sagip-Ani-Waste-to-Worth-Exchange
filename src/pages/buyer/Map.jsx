import { useEffect, useState } from 'react';
import BuyerNavbar from '../../components/buyer/BuyerNavbar';
import Map, { parseLocation } from '../../components/Map';
import { supabase } from '../../lib/supabaseClient';

export default function BuyerMap() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) { setError('Please log in to view the supplier map.'); setLoading(false); return; }
      
      try {
        // Try using the match_map_points view first
        const { data: viewData, error: viewError } = await supabase.from('match_map_points').select('*')
          .eq('buyer_id', authData.user.id)
          .order('score', { ascending: false });
        
        if (!viewError && viewData && viewData.length > 0) {
          setPoints(viewData.map((match) => ({
            lat: match.supplier_latitude,
            lng: match.supplier_longitude,
            role: 'supplier',
            material_type: match.listing_material_type,
            quantity: match.quantity_kg,
            distance_km: match.distance_km,
            label: `Match score: ${formatScore(match.score)}`
          })));
        } else {
          // Fallback: Use the matches table and manually parse location
          const { data: matchData, error: matchError } = await supabase.from('matches').select(`
            id, score, distance_km,
            material_listings!inner (id, material_type, quantity_kg, supplier_id),
            buyer_demands!inner (id, material_type, quantity_needed_kg, buyer_id)
          `).eq('buyer_demands.buyer_id', authData.user.id).order('score', { ascending: false });
          
          if (matchError) throw matchError;
          
          // Also get supplier listing locations from the material_listing_map_points view
          const listingIds = matchData?.map(m => m.material_listings?.id).filter(Boolean) || [];
          let listingLocations = {};
          
          if (listingIds.length > 0) {
            const { data: locationData } = await supabase.from('material_listing_map_points')
              .select('id, latitude, longitude')
              .in('id', listingIds);
            
            if (locationData) {
              listingLocations = locationData.reduce((acc, loc) => {
                acc[loc.id] = { lat: loc.latitude, lng: loc.longitude };
                return acc;
              }, {});
            }
          }
          
          setPoints((matchData || []).map((match) => {
            const location = listingLocations[match.material_listings?.id];
            return location ? {
              ...location,
              role: 'supplier',
              material_type: match.material_listings.material_type,
              quantity: match.material_listings.quantity_kg,
              distance_km: match.distance_km,
              label: `Match score: ${formatScore(match.score)}`
            } : null;
          }).filter(Boolean));
        }
      } catch (err) {
        setError(err.message);
      }
      
      setLoading(false);
    }
    load();
  }, []);

  return <div className="min-h-screen bg-white"><BuyerNavbar /><main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"><div className="mb-7"><div className="inline-flex items-center gap-2 bg-emerald-50 text-[#13422e] px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-2">Supplier Map</div><h1 className="text-3xl font-extrabold text-[#143d2b]">Matched Suppliers</h1><p className="text-sm text-gray-500 mt-1">Green pins represent suppliers from your matched demand posts.</p></div>{error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}{loading ? <div className="h-[520px] flex items-center justify-center text-gray-400 border border-gray-200 rounded-2xl">Loading supplier locations...</div> : <Map points={points} height="600px" />}</main></div>;
}
function formatScore(score) { const value = Number(score); if (!Number.isFinite(value)) return '—'; return value <= 1 ? `${Math.round(value * 100)}%` : `${Math.round(value)}`; }
