import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import SupplierNavbar from '../../components/supplier/SupplierNavbar';

export default function SupplierDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('material_listings')
        .select('*')
        .eq('supplier_id', authData.user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setListings(data);
      }
      setLoading(false);
    }
    fetchListings();
  }, []);

  const totalKg = listings.reduce((acc, curr) => acc + (Number(curr.quantity_kg) || 0), 0);
  const activeCount = listings.filter((l) => l.status === 'listed' || l.status === 'matched').length;

  const renderBadge = (status) => {
    const badges = {
      confirmed: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      requested: 'bg-amber-50 text-amber-800 border-amber-300',
      matched: 'bg-blue-50 text-blue-800 border-blue-300',
      listed: 'bg-gray-100 text-gray-700 border-gray-300',
    };
    return (
      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badges[status] || badges.listed}`}>
        ● {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <SupplierNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header & Main CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#143d2b] tracking-tight">
              My Material Listings
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your agricultural residue batches and view buyer requests across Bukidnon.
            </p>
          </div>
          <Link
            to="/supplier/new-listing"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-[#13422e] hover:bg-[#0e3021] text-white text-sm font-semibold rounded-xl shadow-sm transition"
          >
            + Post New Listing
          </Link>
        </div>

        {/* 3 Metric Cards with Darker Borders & Smooth Hover */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-8">
          <div className="bg-white border-2 border-gray-300 hover:border-[#13422e] hover:bg-emerald-50/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-default">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Listings</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-[#143d2b] flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-[#143d2b] mt-2">{activeCount}</p>
          </div>

          <div className="bg-white border-2 border-gray-300 hover:border-[#13422e] hover:bg-emerald-50/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-default">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Volume Available</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-[#143d2b] flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-[#143d2b] mt-2">
              {totalKg.toLocaleString()} <span className="text-xs font-normal text-gray-500">kg</span>
            </p>
          </div>

          <Link
            to="/supplier/matches"
            className="group bg-white border-2 border-gray-300 hover:border-[#13422e] hover:bg-emerald-50/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Matching Engine</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-[#143d2b] group-hover:bg-[#13422e] group-hover:text-white transition flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-1">
              <span className="text-xs text-gray-500">Pair with verified buyers</span>
              <span className="text-xs font-bold text-[#143d2b] group-hover:underline">Check Matches →</span>
            </div>
          </Link>
        </div>

        {/* Listings Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#143d2b]">Your Active Batches</h2>
            <span className="text-xs font-medium text-gray-500">{listings.length} item(s) total</span>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading your listings...</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-14 px-4 bg-white border-2 border-gray-300 rounded-2xl shadow-sm">
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 border border-emerald-100 text-[#143d2b] flex items-center justify-center text-xl mb-3">
                🌾
              </div>
              <h3 className="text-base font-bold text-[#143d2b]">No materials listed yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-6 leading-relaxed">
                List agricultural residues like pineapple crowns, corn stalks, or husks so nearby Bukidnon buyers can send requests.
              </p>
              <Link
                to="/supplier/new-listing"
                className="inline-flex items-center px-5 py-2.5 bg-[#13422e] hover:bg-[#0e3021] text-white text-sm font-semibold rounded-xl shadow-sm transition"
              >
                Post Your First Listing
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border-2 border-gray-300 hover:border-[#13422e] hover:bg-emerald-50/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#13422e] bg-[#eef8f2] border border-emerald-200 px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#13422e]"></span>
                        Supplier
                      </span>
                      {renderBadge(item.status)}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mt-2">{item.material_type}</h3>
                    <p className="text-2xl font-extrabold text-[#143d2b] mt-1">
                      {Number(item.quantity_kg).toLocaleString()}{' '}
                      <span className="text-sm font-normal text-gray-500">kg</span>
                    </p>

                    <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-600 space-y-1.5">
                      <div className="flex justify-between">
                        <span>Availability:</span>
                        <span className="font-semibold text-gray-800">{item.available_from} to {item.available_until}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50/90 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-gray-500">PostGIS Geotagged</span>
                    <Link
                      to="/supplier/matches"
                      className="text-xs font-bold text-[#143d2b] hover:text-[#0e3021] hover:underline flex items-center gap-1"
                    >
                      View Matches <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}