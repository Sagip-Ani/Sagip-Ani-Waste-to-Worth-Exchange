import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import sagipLogo from '../../assets/logo/sagip-ani-emblem-transparent.png';

export default function SupplierNavbar() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth/login');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold tracking-tight transition-all relative h-full flex items-center ${
      isActive
        ? 'text-[#13422e] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#13422e]'
        : 'text-gray-500 hover:text-[#13422e]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Tabs */}
        <div className="flex items-center gap-10 h-full">
          <Link to="/supplier/dashboard" className="flex items-center gap-3">
            <img
              src={sagipLogo}
              alt="Sagip-Ani Logo"
              className="w-9 h-9 object-contain"
            />
            <div className="leading-tight">
              <span className="text-lg font-black text-[#143d2b] tracking-tight block">
                Sagip-Ani
              </span>
              <span className="block text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
                Waste-to-Worth Exchange
              </span>
            </div>
          </Link>

          {/* Docked Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-8 h-full">
            <NavLink to="/supplier/dashboard" className={navLinkClass}>
              My Listings
            </NavLink>
            <NavLink to="/supplier/matches" className={navLinkClass}>
              Nearby Matches
            </NavLink>
          </nav>
        </div>

        {/* Supplier Profile Pill & Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 bg-emerald-50/70 border border-emerald-200 px-3 py-1.5 rounded-full">
            <div className="w-6 h-6 rounded-full bg-[#13422e] text-white flex items-center justify-center text-xs font-bold">
              S
            </div>
            <div className="leading-none pr-1">
              <span className="text-xs font-bold text-[#13422e] block">
                Agri-Supplier
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                Verified Producer
              </span>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-gray-200"></div>

          <button
            onClick={handleSignOut}
            className="text-xs font-medium text-gray-500 hover:text-red-700 px-2 py-1 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}