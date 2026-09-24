import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BuyerNavbar from '../../components/buyer/BuyerNavbar';
import { supabase } from '../../lib/supabaseClient';

export default function BuyerMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const demandId = searchParams.get('demand');

  useEffect(() => {
    async function load() {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) { setError('Please log in to view your matches.'); setLoading(false); return; }

      let query = supabase.from('matches').select(`
        id, score, distance_km, created_at,
        material_listings!inner (id, material_type, quantity_kg, location, supplier_id),
        buyer_demands!inner (id, material_type, quantity_needed_kg, max_distance_km, buyer_id)
      `).eq('buyer_demands.buyer_id', authData.user.id).order('score', { ascending: false });

      if (demandId) query = query.eq('buyer_demands.id', demandId);
      const { data, error: queryError } = await query;
      if (queryError) setError(queryError.message);
      else setMatches(data || []);
      setLoading(false);
    }
    load();
  }, [demandId]);

  const title = useMemo(() => demandId ? 'Matches for This Demand' : 'Ranked Supplier Matches', [demandId]);

  return <div className="min-h-screen bg-white"><BuyerNavbar /><main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4"><div><div className="inline-flex items-center gap-2 bg-emerald-50 text-[#13422e] px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-2">Matching Engine</div><h1 className="text-3xl sm:text-4xl font-extrabold text-[#143d2b] tracking-tight">{title}</h1><p className="text-sm text-gray-600 mt-2">Supplier matches are ordered by the score stored in the <code>matches</code> table.</p></div><Link to="/buyer/dashboard" className="text-xs font-bold text-[#143d2b] hover:underline">← Back to Demands</Link></div>
    {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    {loading ? <div className="text-center py-20 text-gray-400">Loading ranked matches...</div> : matches.length === 0 ? <div className="text-center py-16 px-4 bg-gray-50 border border-gray-200 rounded-3xl"><div className="text-3xl mb-3">🔎</div><h3 className="text-lg font-bold text-[#143d2b]">No matches yet</h3><p className="text-sm text-gray-500 mt-2">Matching rows will appear here when compatible supplier listings are available.</p></div> : <div className="overflow-x-auto border border-gray-200 rounded-2xl"><table className="w-full min-w-[720px] text-sm"><thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Rank</th><th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Material</th><th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Quantity</th><th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Distance</th><th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Score</th></tr></thead><tbody className="divide-y divide-gray-100">{matches.map((match, index) => <tr key={match.id} className="hover:bg-emerald-50/30"><td className="px-5 py-4 font-bold text-[#13422e]">#{index + 1}</td><td className="px-5 py-4"><div className="font-bold text-gray-900">{match.material_listings?.material_type || '—'}</div><div className="text-xs text-gray-500">For {match.buyer_demands?.material_type || 'your demand'}</div></td><td className="px-5 py-4 text-right font-semibold text-gray-900">{Number(match.material_listings?.quantity_kg || 0).toLocaleString()} kg</td><td className="px-5 py-4 text-right text-gray-700">{match.distance_km != null ? `${Number(match.distance_km).toFixed(1)} km` : '—'}</td><td className="px-5 py-4 text-right"><span className="inline-flex min-w-16 justify-center rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 font-extrabold text-emerald-800">{formatScore(match.score)}</span></td></tr>)}</tbody></table></div>}
  </main></div>;
}

function formatScore(score) {
  const value = Number(score);
  if (!Number.isFinite(value)) return '—';
  return `${value <= 1 ? Math.round(value * 100) : Math.round(value)}${value <= 1 ? '%' : ''}`;
}
