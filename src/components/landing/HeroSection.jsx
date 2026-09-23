import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import heroBg from '../../assets/images/landing/hero-farm.jpg';

export default function HeroSection() {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-gray-900 min-h-0 sm:min-h-[360px] lg:min-h-[400px] flex items-center">
      {/* Background Image with Optimization & Subtle Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Bukidnon farmland with mountains, pineapple crops, and corn harvest"
          className="w-full h-full object-cover object-center scale-[1.01]"
          fetchPriority="high"
        />
        {/* Cinematic gradient overlay for maximum readability while preserving agricultural scenery */}
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/60 to-black/25 sm:to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 w-full">
        <div className="max-w-3xl lg:max-w-4xl">
          
          {/* Supporting Brand Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 mb-3 sm:mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-300">
              SAGIP-ANI • Waste-to-Worth Exchange
            </span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-3 sm:mb-4">
            Turn Agricultural Waste <br className="hidden sm:inline" />
            into <span className="text-emerald-400 font-black">New Opportunities</span>
          </h1>

          {/* Subtitle / Description */}
          <p className="text-base sm:text-lg text-gray-200 font-normal leading-relaxed mb-5 sm:mb-6 max-w-2xl">
            Connect farmers with buyers of agricultural residues and rejected produce in Bukidnon.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/auth/register')}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl font-semibold text-white bg-[#10b981] hover:bg-[#059669] shadow-lg shadow-emerald-950/30 hover:shadow-emerald-900/50 hover:translate-y-[-1px] active:translate-y-0 transition-all duration-150 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={handleLearnMore}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-xs transition-all duration-150 cursor-pointer hover:translate-y-[-1px] active:translate-y-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
            >
              Learn More
            </button>
          </div>

          {/* Small Visual Statement */}
          <div className="mt-5 sm:mt-6 flex items-center gap-3 text-xs sm:text-sm text-gray-300/90 font-medium">
            <span className="inline-block w-6 h-[1px] bg-emerald-400/80" />
            <span>Less waste. More value. For Bukidnon agricultural communities.</span>
          </div>

        </div>
      </div>
    </section>
  );
}

