import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Leaf,
  Coins,
  Users,
  ShieldCheck,
  Sprout,
  Building2
} from 'lucide-react';
import logoImg from '../assets/logo/sagip-ani-logo.png';
import farmBg from '../assets/images/landing/hero-farm.jpg';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('supplier'); // 'supplier' or 'buyer'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setNotice({ type: 'error', message: 'Please complete all required fields.' });
      return;
    }
    if (password !== confirmPassword) {
      setNotice({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    if (password.length < 6) {
      setNotice({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }

    setIsLoading(true);
    setNotice(null);

    setTimeout(() => {
      setIsLoading(false);
      setNotice({
        type: 'info',
        message: 'Account creation will connect to the backend database soon!'
      });
    }, 600);
  };

  const handleGoogleSignUp = () => {
    setNotice({
      type: 'info',
      message: 'Google Sign-Up integration is coming soon.'
    });
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col justify-between bg-gray-50/80 text-gray-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER (Slim & Fixed, Zero Scroll)                */}
      {/* ======================================================== */}
      <header className="shrink-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 sm:h-13 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 rounded-lg py-1 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 transition-transform hover:scale-[1.01]"
            aria-label="Sagip-Ani Home"
          >
            <img
              src={logoImg}
              alt="Sagip-Ani Waste-to-Worth Exchange"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <Sprout className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="italic hidden sm:inline">Less waste. More value.</span>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MAIN CENTERED CARD (Strictly non-scrollable)          */}
      {/* ======================================================== */}
      <main className="flex-1 min-h-0 flex items-center justify-center p-2 sm:p-3 lg:px-6 lg:py-2">
        <div className="w-full max-w-5xl xl:max-w-5.5xl h-full max-h-[580px] bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-200/70 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* ==================================================== */}
          {/* LEFT COLUMN: Agricultural Brand & 4 Pillars          */}
          {/* ==================================================== */}
          <div className="relative lg:col-span-5 h-full flex flex-col justify-between p-5 sm:p-6 lg:p-7 text-white overflow-hidden bg-gray-950">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={farmBg}
                alt="Bukidnon farmland with mountains and pineapple crops"
                className="w-full h-full object-cover object-center scale-[1.02]"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/85" />
              <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-black/30" />
            </div>

            {/* Top Community Pill */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/70 backdrop-blur-md border border-emerald-400/30 text-[11px] font-semibold text-emerald-300">
                <Leaf className="h-3 w-3 text-emerald-400" />
                <span>Join the Sagip-Ani Community</span>
              </div>
            </div>

            {/* Middle: Mission & 4 Pillars */}
            <div className="relative z-10 my-auto py-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight tracking-tight mb-1.5">
                Turn Agricultural <br className="hidden sm:inline" />
                Waste into{' '}
                <span className="text-emerald-400">New Opportunities</span>
              </h1>

              <p className="text-xs text-gray-200/90 leading-relaxed mb-3.5 max-w-xs">
                Connect farmers with buyers of agricultural residues and rejected produce in Bukidnon.
              </p>

              {/* 4 Pillars List */}
              <div className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Leaf className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white leading-tight">Reduce Waste</h3>
                    <p className="text-[11px] text-gray-300/85 leading-tight">Give agricultural by-products new life.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Coins className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white leading-tight">Earn More</h3>
                    <p className="text-[11px] text-gray-300/85 leading-tight">Turn waste into additional income.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white leading-tight">Support Local</h3>
                    <p className="text-[11px] text-gray-300/85 leading-tight">Strengthen Bukidnon's agricultural communities.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white leading-tight">Build a Sustainable Future</h3>
                    <p className="text-[11px] text-gray-300/85 leading-tight">For a cleaner environment and a greener tomorrow.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Tagline */}
            <div className="relative z-10 pt-2 border-t border-white/15 text-[11px] text-gray-300 flex items-center justify-between">
              <span>📍 Bukidnon, Northern Mindanao</span>
              <span>Sagip-Ani</span>
            </div>
          </div>

          {/* ==================================================== */}
          {/* RIGHT COLUMN: Full Registration Form (No Scrollbar) */}
          {/* ==================================================== */}
          <div className="relative lg:col-span-7 h-full p-5 sm:p-6 lg:p-6 xl:p-7 flex flex-col justify-between bg-white overflow-hidden">
            
            {/* Subtle Watermark */}
            <div className="pointer-events-none absolute right-0 bottom-0 select-none opacity-15 text-emerald-900/10 hidden sm:block">
              <svg width="120" height="120" viewBox="0 0 200 200" fill="currentColor">
                <path d="M 180 180 C 130 180 90 140 90 90 C 140 90 180 130 180 180 Z" opacity="0.6" />
                <path d="M 160 140 C 120 140 85 105 85 65 C 125 65 160 100 160 140 Z" opacity="0.4" />
                <path d="M 200 120 C 160 120 130 90 130 50 C 170 50 200 80 200 120 Z" opacity="0.3" />
              </svg>
            </div>

            <div className="max-w-md w-full mx-auto flex flex-col justify-between h-full">
              
              {/* Form Heading Header */}
              <div className="shrink-0 mb-1">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200/60 mb-1">
                  <Sprout className="h-3 w-3 text-emerald-600" />
                  <span>Create Account</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0d4722] tracking-tight leading-tight">
                  Get Started with Sagip-Ani
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Join our platform and be part of a more sustainable agricultural value chain.
                </p>
              </div>

              {/* Notice Banner */}
              {notice && (
                <div
                  className={`my-1 p-2 rounded-lg text-xs flex items-start gap-1.5 transition-all ${
                    notice.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  <span className="font-medium">{notice.message}</span>
                </div>
              )}

              {/* Registration Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-2 shrink-0">
                
                {/* Field: Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-xs font-semibold text-gray-700 mb-0.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-1.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 shadow-2xs transition-all focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>
                </div>

                {/* Field: Email Address */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-0.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Mail className="h-3.5 w-3.5" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-1.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 shadow-2xs transition-all focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>
                </div>

                {/* Field: Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 mb-0.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Phone className="h-3.5 w-3.5" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+63 9XX XXX XXXX"
                      className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-1.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 shadow-2xs transition-all focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>
                </div>

                {/* Row: Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="regPassword" className="block text-xs font-semibold text-gray-700 mb-0.5">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <Lock className="h-3.5 w-3.5" />
                      </div>
                      <input
                        id="regPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-8 py-1.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 shadow-2xs transition-all focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 mb-0.5">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <Lock className="h-3.5 w-3.5" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-8 py-1.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 shadow-2xs transition-all focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <span className="block text-xs font-semibold text-gray-700 mb-1">
                    Select Your Role <span className="text-red-500">*</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    
                    {/* Supplier */}
                    <button
                      type="button"
                      onClick={() => setRole('supplier')}
                      className={`flex items-center justify-between p-2 rounded-xl border text-left cursor-pointer transition-all duration-150 ${
                        role === 'supplier'
                          ? 'border-emerald-700 bg-emerald-50/70 shadow-2xs ring-1 ring-emerald-700/30'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          role === 'supplier' ? 'bg-[#0d4722] text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Sprout className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 leading-tight">Supplier</div>
                          <div className="text-[10px] text-gray-500 leading-tight">Farmer / Coop / Packing</div>
                        </div>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ml-1 ${
                        role === 'supplier' ? 'border-emerald-700' : 'border-gray-300'
                      }`}>
                        {role === 'supplier' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-700" />}
                      </div>
                    </button>

                    {/* Buyer */}
                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className={`flex items-center justify-between p-2 rounded-xl border text-left cursor-pointer transition-all duration-150 ${
                        role === 'buyer'
                          ? 'border-emerald-700 bg-emerald-50/70 shadow-2xs ring-1 ring-emerald-700/30'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          role === 'buyer' ? 'bg-[#0d4722] text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 leading-tight">Buyer</div>
                          <div className="text-[10px] text-gray-500 leading-tight">Processor / Business</div>
                        </div>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ml-1 ${
                        role === 'buyer' ? 'border-emerald-700' : 'border-gray-300'
                      }`}>
                        {role === 'buyer' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-700" />}
                      </div>
                    </button>

                  </div>
                </div>

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-white bg-[#0d4722] hover:bg-[#072c15] shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700 text-xs sm:text-sm"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </span>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Actions: OR + Google + Login (Clearly separated, not squished) */}
              <div className="shrink-0 pt-1">
                {/* Divider: OR */}
                <div className="relative my-1.5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                    <span className="bg-white px-2 text-gray-400 font-semibold">OR</span>
                  </div>
                </div>

                {/* Continue with Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer hover:translate-y-[-1px] active:translate-y-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-gray-400 text-xs"
                >
                  <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
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

                {/* Login Link */}
                <div className="mt-1.5 text-center text-xs text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/auth/login"
                    className="font-bold text-[#0d4722] hover:text-[#072c15] hover:underline"
                  >
                    Login
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* ======================================================== */}
      {/* 3. SUBTLE FOOTER                                         */}
      {/* ======================================================== */}
      <footer className="shrink-0 text-center py-1 text-[11px] text-gray-400 border-t border-gray-100 bg-white/60 flex items-center justify-center gap-1.5 px-4">
        <span>© {new Date().getFullYear()} Sagip-Ani</span>
        <span>•</span>
        <span>Waste-to-Worth Exchange</span>
        <span>•</span>
        <span>Bukidnon, Philippines</span>
      </footer>

    </div>
  );
}
