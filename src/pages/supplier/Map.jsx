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
      const { data, error: queryError } = await supabase.from('matches').select(`
        id, score, distance_km,
        material_listings!inner (id, material_type, quantity_kg, location, supplier_id),
        buyer_demands!inner (id, material_type, quantity_needed_kg, location, buyer_id)
      `).eq('material_listings.supplier_id', authData.user.id).order('score', { ascending: false });
      if (queryError) setError(queryError.message);
      else setPoints((data || []).map((match) => {
        const location = parseLocation(match.buyer_demands?.location);
        return location ? { ...location, role: 'buyer', material_type: match.buyer_demands.material_type, quantity: match.buyer_demands.quantity_needed_kg, distance_km: match.distance_km, label: `Match score: ${formatScore(match.score)}` } : null;
      }).filter(Boolean));
      setLoading(false);
    }
    load();
  }, []);

  return <div className="min-h-screen bg-white"><SupplierNavbar /><main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"><div className="mb-7"><div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-2">Buyer Map</div><h1 className="text-3xl font-extrabold text-[#143d2b]">Matched Buyers</h1><p className="text-sm text-gray-500 mt-1">Blue pins represent buyers from your matched demand posts.</p></div>{error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}{loading ? <div className="h-[520px] flex items-center justify-center text-gray-400 border border-gray-200 rounded-2xl">Loading buyer locations...</div> : <Map points={points} height="600px" />}</main></div>;
}
function formatScore(score) { const value = Number(score); if (!Number.isFinite(value)) return '—'; return value <= 1 ? `${Math.round(value * 100)}%` : `${Math.round(value)}`; }
