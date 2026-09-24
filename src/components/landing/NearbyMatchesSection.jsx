import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Plus, Minus, Info, X, CheckCircle2 } from 'lucide-react';
import pineImg from '../../assets/images/landing/pineapple-crowns.jpg';
import cornImg from '../../assets/images/landing/corn-husks.jpg';
import rejImg from '../../assets/images/landing/rejected-produce.jpg';

const materials = [
  {
    id: 'mat-1',
    title: 'Pineapple Crowns',
    role: 'Supplier',
    roleColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    amount: '500 kg',
    location: 'Manolo Fortich, Bukidnon',
    distance: '4.2 km away',
    compatibility: 92,
    image: pineImg,
    alt: 'Fresh pineapple crowns and leaves in Bukidnon',
  },
  {
    id: 'mat-2',
    title: 'Corn Husks',
    role: 'Supplier',
    roleColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    amount: '300 kg',
    location: 'Malaybalay, Bukidnon',
    distance: '8.5 km away',
    compatibility: 87,
    image: cornImg,
    alt: 'Clean dried corn husks by-product in Bukidnon',
  },
  {
    id: 'mat-3',
    title: 'BioChar PH',
    role: 'Buyer',
    roleColor: 'bg-blue-100 text-blue-800 border-blue-200',
    amount: 'Needs: Pineapple Waste',
    location: 'Manolo Fortich, Bukidnon',
    distance: '12.3 km away',
    compatibility: 93,
    image: rejImg,
    alt: 'Organic crop residue collected for biochar in Bukidnon',
  },
];

export default function NearbyMatchesSection() {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState(null);
  const [mapZoom, setMapZoom] = useState(1);

  const handleViewDetails = (item) => {
    setToastMessage({
      title: `${item.title}`,
      description: 'Matching details will be available after registration.',
    });
  };

  return (
    <section id="features" className="py-16 sm:py-24 bg-white border-b border-gray-100 relative">
      
      {/* Toast Notification for View Details */}
      {toastMessage && (
        <div 
          role="status" 
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-white rounded-2xl shadow-xl border border-emerald-200 p-4 animate-in slide-in-from-bottom-5 duration-200 flex items-start gap-3.5"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-900">{toastMessage.title}</h4>
              <button 
                type="button" 
                onClick={() => setToastMessage(null)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1">{toastMessage.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/auth/register')}
                className="px-3 py-1.5 rounded-lg bg-[#0d4722] hover:bg-[#093519] text-white text-xs font-semibold cursor-pointer"
              >
                Register to Connect
              </button>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-50 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with 'View All Matches' Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-[3px] bg-emerald-600 rounded-full inline-block" />
              <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase">
                Nearby Matches
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              Available Materials Near You
            </h2>
            <p className="mt-2 text-base text-gray-600">
              Discover agricultural by-products and connect with local buyers in Bukidnon.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => navigate('/auth/login')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-[#0d4722] hover:bg-[#093519] shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer"
            >
              <span>View All Matches</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Content Layout: 3 Material Cards + 1 Map Preview Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* 3 Material Cards */}
          {materials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col hover:border-emerald-300 hover:shadow-md transition-all duration-200 group"
            >
              {/* Card Image with Role Tag Badge */}
              <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-xs shadow-xs ${item.roleColor}`}
                >
                  ● {item.role}
                </span>
              </div>

              {/* Card Content Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs text-gray-600 mt-1">
                    <span className="font-semibold text-gray-800">{item.amount}</span>
                    <span className="mx-1.5 text-gray-400">•</span>
                    <span>{item.location}</span>
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item.distance}</span>
                  </div>
                </div>

                {/* Compatibility indicator & Action button */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-emerald-800">
                      {item.compatibility}% compatibility
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleViewDetails(item)}
                    className="w-full py-2 px-3 text-center text-xs font-bold text-gray-700 hover:text-emerald-800 border border-gray-300 hover:border-emerald-600 rounded-lg hover:bg-emerald-50/50 transition-all cursor-pointer"
                  >
                    View Details
                  </button>
                </div>

              </div>
            </div>
          ))}

          {/* Map Preview Card (Visual interactive representation) */}
          <div className="bg-[#e9f4eb] rounded-2xl border border-emerald-200 overflow-hidden flex flex-col relative group">
            
            {/* Map Canvas Visual (Bukidnon Landscape representation) */}
            <div className="relative flex-1 min-h-[220px] bg-[#eef7ee] overflow-hidden p-3 flex flex-col justify-between">
              
              {/* Map Graphic Simulation: Terrain contour lines & highways */}
              <svg 
                className="absolute inset-0 w-full h-full opacity-60" 
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 300 220"
                preserveAspectRatio="none"
              >
                {/* Mountain ridges / terrain contours */}
                <path d="M 0,160 Q 80,120 160,170 T 300,140" fill="none" stroke="#c8e6c9" strokeWidth="20" opacity="0.4" />
                <path d="M 0,90 Q 90,40 180,80 T 300,50" fill="none" stroke="#dcedc8" strokeWidth="24" opacity="0.5" />
                {/* Sayre Highway representation */}
                <path d="M 120,0 Q 150,110 180,220" fill="none" stroke="#fcd34d" strokeWidth="3" />
                <path d="M 0,130 Q 140,110 300,100" fill="none" stroke="#fef08a" strokeWidth="2" />
                {/* River */}
                <path d="M 30,0 Q 60,100 40,220" fill="none" stroke="#bfdbfe" strokeWidth="3" opacity="0.7" />
              </svg>

              {/* Bukidnon Region Label watermark */}
              <div className="relative z-10 text-center text-emerald-800/40 text-xs font-bold tracking-widest uppercase select-none mt-2">
                Bukidnon
              </div>

              {/* Map Floating Pins */}
              <div 
                className="relative z-10 w-full h-full flex-1 transition-transform duration-200"
                style={{ transform: `scale(${mapZoom})` }}
              >
                {/* Supplier Pin 1 with Tooltip */}
                <div className="absolute top-[25%] left-[28%] flex flex-col items-center cursor-pointer">
                  {/* Tooltip */}
                  <div className="bg-white/95 backdrop-blur-xs px-2 py-1 rounded-md shadow-md border border-gray-200 text-[10px] text-gray-800 font-semibold mb-1 whitespace-nowrap">
                    Pineapple Crowns • 500 kg
                  </div>
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md animate-bounce ring-2 ring-white">
                    <MapPin className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                  </div>
                </div>

                {/* Supplier Pin 2 */}
                <div className="absolute top-[60%] left-[55%] flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm ring-2 ring-white">
                    <MapPin className="w-2.5 h-2.5 fill-emerald-600 text-white" />
                  </div>
                </div>

                {/* Supplier Pin 3 */}
                <div className="absolute top-[40%] right-[22%] flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm ring-2 ring-white">
                    <MapPin className="w-2.5 h-2.5 fill-emerald-600 text-white" />
                  </div>
                </div>

                {/* Buyer Pin 1 (Blue) */}
                <div className="absolute top-[35%] left-[12%] flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm ring-2 ring-white">
                    <MapPin className="w-2.5 h-2.5 fill-blue-600 text-white" />
                  </div>
                </div>

                {/* Buyer Pin 2 (Blue) */}
                <div className="absolute bottom-[20%] right-[35%] flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm ring-2 ring-white">
                    <MapPin className="w-2.5 h-2.5 fill-blue-600 text-white" />
                  </div>
                </div>
              </div>

              {/* Map Zoom Controls */}
              <div className="absolute bottom-3 right-3 z-20 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMapZoom(prev => Math.min(prev + 0.15, 1.3))}
                  className="p-1.5 hover:bg-gray-50 text-gray-700 border-b border-gray-100 cursor-pointer"
                  aria-label="Zoom in"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMapZoom(prev => Math.max(prev - 0.15, 0.85))}
                  className="p-1.5 hover:bg-gray-50 text-gray-700 cursor-pointer"
                  aria-label="Zoom out"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Map Legend & Bottom Bar */}
            <div className="p-3.5 bg-white border-t border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                  Suppliers
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                  Buyers
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate('/auth/login')}
                className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold cursor-pointer shadow-2xs"
              >
                Explore Matches
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

