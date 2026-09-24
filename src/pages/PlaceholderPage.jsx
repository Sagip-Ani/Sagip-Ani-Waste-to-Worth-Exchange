import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Sprout } from 'lucide-react';
import logoImg from '../assets/logo/sagip-ani-logo.png';

export default function PlaceholderPage({ title, description }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Header Bar */}
      <header className="bg-white border-b border-gray-200 py-3.5 px-4 sm:px-6 lg:px-8 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer focus:outline-hidden transition-transform hover:scale-[1.01]"
          >
            <img src={logoImg} alt="Sagip-Ani logo" className="h-8 sm:h-9 w-auto" />
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-emerald-900 bg-emerald-50/90 hover:bg-emerald-100/90 border border-emerald-200/80 hover:border-emerald-300 transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-700 transition-transform duration-150 group-hover:-translate-x-0.5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Placeholder Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-sm text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
            <Clock className="w-7 h-7 stroke-[2]" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-3">
            {title || 'Upcoming Feature'}
          </span>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-3">
            This page is coming soon.
          </h1>

          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            {description || 'This feature is currently under active development as part of the Sagip-Ani Waste-to-Worth Exchange roadmap.'}
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-white bg-[#0d4722] hover:bg-[#093519] transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Landing Page</span>
          </button>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="text-center py-6 text-xs text-gray-500 border-t border-gray-200 bg-white flex items-center justify-center gap-1.5">
        <span>© 2026 Sagip-Ani • Waste-to-Worth Exchange</span>
        <Sprout className="w-3.5 h-3.5 text-emerald-600" />
      </footer>
    </div>
  );
}

