import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoImg from '../../assets/logo/sagip-ani-logo.png';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  // Track active section on scroll if on home page
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const howItWorks = document.getElementById('how-it-works');
      const benefits = document.getElementById('about');
      const features = document.getElementById('features');

      if (features && scrollY >= features.offsetTop - 180) {
        setActiveSection('features');
      } else if (howItWorks && scrollY >= howItWorks.offsetTop - 180) {
        setActiveSection('how-it-works');
      } else if (benefits && scrollY >= benefits.offsetTop - 180) {
        setActiveSection('about');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        if (id === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('home');
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-xs transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Logo Brand */}
          <button 
            type="button"
            onClick={() => scrollTo('top')}
            className="flex items-center focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg py-1 text-left cursor-pointer group"
            aria-label="Sagip-Ani Home"
          >
            <img 
              src={logoImg} 
              alt="Sagip-Ani Waste-to-Worth Exchange" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]" 
            />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-8" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => scrollTo('top')}
              className={`relative px-3 py-2 text-sm font-semibold transition-colors duration-150 cursor-pointer ${
                activeSection === 'home'
                  ? 'text-emerald-800'
                  : 'text-gray-600 hover:text-emerald-700'
              }`}
            >
              Home
              {activeSection === 'home' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.75 bg-emerald-700 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => scrollTo('about')}
              className={`relative px-3 py-2 text-sm font-semibold transition-colors duration-150 cursor-pointer ${
                activeSection === 'about'
                  ? 'text-emerald-800'
                  : 'text-gray-600 hover:text-emerald-700'
              }`}
            >
              About
              {activeSection === 'about' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.75 bg-emerald-700 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => scrollTo('how-it-works')}
              className={`relative px-3 py-2 text-sm font-semibold transition-colors duration-150 cursor-pointer ${
                activeSection === 'how-it-works'
                  ? 'text-emerald-800'
                  : 'text-gray-600 hover:text-emerald-700'
              }`}
            >
              How It Works
              {activeSection === 'how-it-works' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.75 bg-emerald-700 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => scrollTo('features')}
              className={`relative px-3 py-2 text-sm font-semibold transition-colors duration-150 cursor-pointer ${
                activeSection === 'features'
                  ? 'text-emerald-800'
                  : 'text-gray-600 hover:text-emerald-700'
              }`}
            >
              Features
              {activeSection === 'features' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.75 bg-emerald-700 rounded-full" />
              )}
            </button>
          </nav>

          {/* Desktop Right Side: Login & Register */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate('/auth/login')}
              className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-900 border border-gray-300 hover:border-emerald-600 rounded-lg transition-all duration-150 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate('/auth/register')}
              className="px-5 py-2 text-sm font-semibold text-white bg-[#0d4722] hover:bg-[#093519] rounded-lg shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              Register
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            <button
              type="button"
              onClick={() => scrollTo('top')}
              className={`text-left px-3 py-2.5 rounded-md text-base font-semibold transition-colors cursor-pointer ${
                activeSection === 'home'
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollTo('about')}
              className={`text-left px-3 py-2.5 rounded-md text-base font-semibold transition-colors cursor-pointer ${
                activeSection === 'about'
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              About
            </button>
            <button
              type="button"
              onClick={() => scrollTo('how-it-works')}
              className={`text-left px-3 py-2.5 rounded-md text-base font-semibold transition-colors cursor-pointer ${
                activeSection === 'how-it-works'
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollTo('features')}
              className={`text-left px-3 py-2.5 rounded-md text-base font-semibold transition-colors cursor-pointer ${
                activeSection === 'features'
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Features
            </button>
          </nav>

          <div className="pt-3 border-t border-gray-100 flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/auth/login');
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/auth/register');
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#0d4722] hover:bg-[#093519] rounded-lg shadow-xs cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

