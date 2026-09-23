import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import SupplierNavbar from '../../components/supplier/SupplierNavbar';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          score,
          distance_km,
          material_listings!inner (
            id,
            material_type,
            quantity_kg,
            supplier_id
          ),
          buyer_demands (
            id,
            material_type,
            quantity_needed_kg,
            max_distance_km
          )
        `)
        .eq('material_listings.supplier_id', authData.user.id)
        .order('score', { ascending: false });

      if (!error && data) {
        setMatches(data);
      }
      setLoading(false);
    }
    loadMatches();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SupplierNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-[#13422e]/10 text-[#13422e] px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#13422e]"></span>
            Nearby Matches
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#143d2b] tracking-tight">
                Matched Buyer Demands
              </h1>
              <p className="text-base text-gray-600 mt-2">
                Scored automatically based on material type, distance radius, and quantity alignment.
              </p>
            </div>
            <Link
              to="/supplier/dashboard"
              className="text-xs font-bold text-[#143d2b] hover:underline"
            >
              ← Back to Listings
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Searching for matched demands...</div>
        ) : matches.length === 0 ? (
          <div className="text-center py-16 px-4 bg-gray-50/50 border border-gray-200 rounded-3xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-[#143d2b] flex items-center justify-center text-2xl mb-4">
              🔍
            </div>
            <h3 className="text-lg font-bold text-[#143d2b]">No buyer matches yet</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
              As animal feed, biochar, and biogas processors post demands in Bukidnon, the matching engine will automatically pair them here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="p-6">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      Buyer Demand
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                      ✓ {Math.round((match.score || 0) * 100)}% compatibility
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">
                    {match.buyer_demands?.material_type}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Matches your <span className="font-semibold text-gray-700">{match.material_listings?.material_type}</span>
                  </p>

                  <div className="mt-5 pt-4 border-t border-gray-100 text-xs text-gray-600 space-y-2">
                    <div className="flex justify-between">
                      <span>Volume Needed:</span>
                      <span className="font-bold text-gray-900">{match.buyer_demands?.quantity_needed_kg} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Proximity:</span>
                      <span className="font-bold text-gray-900">
                        {match.distance_km ? `${Number(match.distance_km).toFixed(1)} km away` : 'Within radius'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50/70 border-t border-gray-100">
                  <button
                    onClick={() => alert('Requests are initiated via Member 5’s /requests workflow')}
                    className="w-full py-2.5 bg-[#13422e] hover:bg-[#0e3021] text-white text-xs font-bold rounded-xl transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}