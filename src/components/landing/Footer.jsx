import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Mail, Send, CheckCircle2 } from 'lucide-react';
import logoImg from '../../assets/logo/sagip-ani-logo.png';

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const scrollTo = (id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#072413] text-gray-300 pt-16 pb-12 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Brand & Mission (Col 1-5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-xl inline-block">
                <img
                  src={logoImg}
                  alt="Sagip-Ani logo"
                  className="h-9 w-auto object-contain"
                />
              </div>
            </div>

            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Turning agricultural waste into a stronger, greener Bukidnon. Connecting farmers with local processors to create sustainable value.
            </p>

            <div className="pt-2 text-xs text-emerald-400/90 font-medium">
              📍 Bukidnon, Northern Mindanao, Philippines
            </div>
          </div>

          {/* Navigation Links (Col 6-8) */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                Platform
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollTo('top')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollTo('about')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollTo('how-it-works')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollTo('features')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Features
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                Account
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/auth/login')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/auth/register')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Register
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Signup (Col 9-12) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Stay Updated
            </h3>
            <p className="text-xs text-gray-400">
              Get the latest updates, matching alerts, and agricultural opportunities in Bukidnon.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thank you! You are subscribed to updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  aria-label="Email address for newsletter"
                  className="bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-hidden focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 flex-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            )}

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook page"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <span className="font-bold text-xs">f</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram profile"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <span className="font-bold text-xs">ig</span>
              </a>
              <a
                href="mailto:contact@sagip-ani.ph"
                aria-label="Send email"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div>
            © 2026 Sagip-Ani. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <span>For a sustainable agricultural future</span>
            <Sprout className="w-4 h-4" />
          </div>
        </div>

      </div>
    </footer>
  );
}

