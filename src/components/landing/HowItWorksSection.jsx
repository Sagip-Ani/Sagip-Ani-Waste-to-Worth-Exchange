import { UserCheck, ClipboardList, Handshake, MessageSquare, ArrowRight, Sprout } from 'lucide-react';
import farmerImg from '../../assets/images/landing/how-it-works.jpg';

const steps = [
  {
    stepNumber: 1,
    icon: UserCheck,
    title: 'Register',
    description: 'Create an account and choose whether you are a Supplier or Buyer.',
  },
  {
    stepNumber: 2,
    icon: ClipboardList,
    title: 'List or Post',
    description: 'Suppliers list agricultural by-products. Buyers post material needs.',
  },
  {
    stepNumber: 3,
    icon: Handshake,
    title: 'Get Matched',
    description: 'The system compares material compatibility, distance, and quantity.',
  },
  {
    stepNumber: 4,
    icon: MessageSquare,
    title: 'Connect',
    description: 'Send a request and coordinate collection after confirmation.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-[#fafbfc] border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Pill & Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[3px] bg-emerald-600 rounded-full inline-block" />
            <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase">
              How It Works
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            Simple Steps to Create Value
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-600">
            From waste to opportunity — it's easy, fast, and local.
          </p>
        </div>

        {/* Steps + Organic Visual Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Steps Horizontal Sequence (Col 1-8 on desktop) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={step.stepNumber} className="relative flex flex-col items-start group">
                    
                    {/* Top Row: Number badge + Icon box + Connecting arrow for desktop */}
                    <div className="flex items-center w-full mb-4">
                      
                      {/* Step Number in Dark Green Circle */}
                      <div className="w-8 h-8 rounded-full bg-[#0d4722] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                        {step.stepNumber}
                      </div>

                      {/* Icon Container */}
                      <div className="ml-2 w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100/60 group-hover:scale-105 group-hover:bg-emerald-100 transition-all">
                        <Icon className="w-5 h-5 stroke-[2]" />
                      </div>

                      {/* Desktop connecting arrow to next step */}
                      {idx < steps.length - 1 && (
                        <div className="hidden lg:flex items-center justify-center flex-1 pl-2">
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                        </div>
                      )}
                    </div>

                    {/* Step Title & Description */}
                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-emerald-800 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Organic Farmer Visual Mask (Col 9-12) */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-4/3 rounded-3xl overflow-hidden shadow-md group">
              <img
                src={farmerImg}
                alt="Filipino farmer looking over agricultural fields in Bukidnon"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Handwritten overlay script & sprout doodle */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-right drop-shadow-md">
                <span className="text-lg sm:text-xl font-bold italic tracking-tight text-white block">
                  Local farmers.
                </span>
                <span className="text-base sm:text-lg font-bold italic text-emerald-300 block">
                  Real impact.
                </span>
              </div>

              {/* Decorative bottom leaf accent */}
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs text-emerald-200/90 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10">
                <Sprout className="w-3.5 h-3.5 text-emerald-300" />
                <span>Bukidnon, Northern Mindanao</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

