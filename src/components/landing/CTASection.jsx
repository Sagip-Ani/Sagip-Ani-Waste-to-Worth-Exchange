import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  const navigate = useNavigate();

  const handleExplore = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-[#0d4722] text-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white">
          Ready to Turn Waste Into Value?
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg lg:text-xl text-emerald-100/90 font-normal max-w-2xl mx-auto mb-10 leading-relaxed">
          Join Sagip-Ani and connect agricultural resources with new opportunities across Bukidnon.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/auth/register')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base text-[#0d4722] bg-white hover:bg-emerald-50 shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={handleExplore}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-base text-white border border-emerald-400/50 hover:bg-emerald-800/80 transition-all duration-150 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
          >
            Explore How It Works
          </button>
        </div>

      </div>
    </section>
  );
}

