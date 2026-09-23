import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Leaf, Users, Sprout, Check } from 'lucide-react';
import logoImg from '../assets/logo/sagip-ani-logo.png';
import farmBg from '../assets/images/landing/hero-farm.jpg';

export default function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim() || !password) {
      setNotice({ type: 'error', message: 'Please enter both your email/phone and password.' });
      return;
    }
    setIsLoading(true);
    setNotice(null);

    // Simulated login feedback
    setTimeout(() => {
      setIsLoading(false);
      setNotice({
        type: 'info',
        message: 'Account authentication will connect to the backend database soon!'
      });
    }, 600);
  };

  const handleGoogleSignIn = () => {
    setNotice({
      type: 'info',
      message: 'Google Sign-In integration is coming soon.'
    });
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setNotice({
      type: 'info',
      message: 'Password recovery will send instructions to your registered email or phone.'
    });
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col justify-between bg-gray-50/80 text-gray-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* ======================================================== */}
      {/* 1. TOP NAVIGATION / HEADER (Compact, No Back Button)     */}
      {/* ======================================================== */}
      <header className="shrink-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 rounded-lg py-1 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 transition-transform hover:scale-[1.01]"
            aria-label="Sagip-Ani Home"
          >
            <img
              src={logoImg}
              alt="Sagip-Ani Waste-to-Worth Exchange"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </Link>

          {/* Subtle Tagline in place of messy button */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <Sprout className="h-3.5 w-3.5 text-emerald-600" />
            <span>Building a more sustainable agricultural value chain</span>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MAIN CENTERED CARD CONTAINER (Fits viewport cleanly)  */}
      {/* ======================================================== */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-5 lg:p-6 min-h-0">
        <div className="w-full max-w-5xl xl:max-w-5.5xl bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-200/70 overflow-hidden grid grid-cols-1 lg:grid-cols-12 lg:max-h-[560px]">
          
          {/* ==================================================== */}
          {/* LEFT COLUMN: Agricultural Brand & Mission Banner     */}
          {/* ==================================================== */}
          <div className="relative lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 lg:p-8 text-white overflow-hidden bg-gray-950 min-h-[220px] lg:min-h-0">
            {/* Scenic Farmland Background */}
            <div className="absolute inset-0 z-0">
              <img
                src={farmBg}
                alt="Bukidnon farmland with mountains, pineapple crops, and corn harvest"
                className="w-full h-full object-cover object-center scale-[1.02]"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/45 to-black/85" />
              <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-black/30" />
            </div>

            {/* Mission Headline & Copy (Neon pill completely removed) */}
            <div className="relative z-10 my-auto py-2 lg:py-0">
              <h1 className="text-xl sm:text-2xl lg:text-[28px] font-extrabold text-white leading-snug tracking-tight mb-2.5">
                Connecting Farmers with Buyers for a{' '}
                <span className="text-emerald-400">Sustainable Tomorrow</span>
              </h1>

              <p className="text-xs sm:text-sm text-gray-200/90 font-normal leading-relaxed mb-4 max-w-sm">
                Turn agricultural residues and rejected produce into new opportunities. Together, we create value for farmers, businesses, and the environment.
              </p>

              {/* Three Value Badges */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-xs font-medium text-emerald-200">
                  <Leaf className="h-3 w-3 text-emerald-400" />
                  <span>Less Waste</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-xs font-medium text-emerald-200">
                  <Users className="h-3 w-3 text-emerald-400" />
                  <span>More Value</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-xs font-medium text-emerald-200">
                  <Sprout className="h-3 w-3 text-emerald-400" />
                  <span>A Greener Bukidnon</span>
                </div>
              </div>
            </div>

            {/* Bottom Tagline */}
            <div className="relative z-10 pt-3 border-t border-white/15 text-[11px] text-gray-300 flex items-center justify-between">
              <span>📍 Bukidnon, Northern Mindanao</span>
              <span>Sagip-Ani</span>
            </div>
          </div>

          {/* ==================================================== */}
          {/* RIGHT COLUMN: Authentication Form                    */}
          {/* ==================================================== */}
          <div className="relative lg:col-span-7 p-6 sm:p-7 lg:p-8 xl:p-9 flex flex-col justify-center bg-white overflow-y-auto">
            
            {/* Subtle Watermark */}
            <div className="pointer-events-none absolute right-0 bottom-0 select-none opacity-15 text-emerald-900/10 hidden sm:block">
              <svg width="140" height="140" viewBox="0 0 200 200" fill="currentColor">
                <path d="M 180 180 C 130 180 90 140 90 90 C 140 90 180 130 180 180 Z" opacity="0.6" />
                <path d="M 160 140 C 120 140 85 105 85 65 C 125 65 160 100 160 140 Z" opacity="0.4" />
                <path d="M 200 120 C 160 120 130 90 130 50 C 170 50 200 80 200 120 Z" opacity="0.3" />
              </svg>
            </div>

            <div className="max-w-md w-full mx-auto">
              
              {/* Form Heading */}
              <div className="mb-4 sm:mb-5">
                <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#0d4722] tracking-tight">
                  Welcome back!
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  Sign in to your Sagip-Ani account
                </p>
              </div>

              {/* Notice Banner */}
              {notice && (
                <div
                  className={`mb-3.5 p-3 rounded-xl text-xs sm:text-sm flex items-start gap-2 transition-all ${
                    notice.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  <span className="font-medium">{notice.message}</span>
                </div>
              )}

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
                
                {/* Field: Email or Phone */}
                <div>
                  <label htmlFor="emailOrPhone" className="block text-xs font-semibold text-gray-700 mb-1">
                    Email or Phone Number
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="emailOrPhone"
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="Enter your email or phone number"
                      className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 shadow-2xs transition-all focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>
                </div>

                {/* Field: Password */}
                <div>
                  <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-10 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 shadow-2xs transition-all focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                        rememberMe
                          ? 'bg-emerald-700 border-emerald-700 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {rememberMe && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className="text-xs text-gray-600 font-medium">Remember Me</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Primary Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl font-semibold text-white bg-[#0d4722] hover:bg-[#072c15] shadow-sm shadow-emerald-950/20 hover:shadow-md transition-all duration-150 cursor-pointer hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700 text-sm"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider: OR */}
              <div className="relative my-4 sm:my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                  <span className="bg-white px-2.5 text-gray-400 font-semibold">OR</span>
                </div>
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-2.5 px-5 py-2 sm:py-2.5 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer hover:translate-y-[-1px] active:translate-y-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-gray-400 text-xs sm:text-sm"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Registration Link */}
              <div className="mt-3.5 sm:mt-4 text-center text-xs text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/auth/register"
                  className="font-bold text-[#0d4722] hover:text-[#072c15] hover:underline"
                >
                  Register
                </Link>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* ======================================================== */}
      {/* 3. SUBTLE COMPACT FOOTER                                 */}
      {/* ======================================================== */}
      <footer className="shrink-0 text-center py-2 sm:py-2.5 text-[11px] text-gray-400 border-t border-gray-100 bg-white/60 flex items-center justify-center gap-1.5 px-4">
        <span>© {new Date().getFullYear()} Sagip-Ani</span>
        <span>•</span>
        <span>Waste-to-Worth Exchange</span>
        <span>•</span>
        <span>Bukidnon, Philippines</span>
      </footer>

    </div>
  );
}
