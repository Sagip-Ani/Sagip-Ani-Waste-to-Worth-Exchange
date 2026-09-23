import { Leaf, Coins, Users, ShieldCheck } from 'lucide-react';

const benefits = [
  {
    id: 'reduce-waste',
    icon: Leaf,
    title: 'Reduce Waste',
    description: 'Keep agricultural residues out of landfills and open burning.',
  },
  {
    id: 'earn-more',
    icon: Coins,
    title: 'Earn More',
    description: 'Turn your agricultural by-products into additional income.',
  },
  {
    id: 'support-local',
    icon: Users,
    title: 'Support Local',
    description: 'Connect farmers with nearby buyers and processors in Bukidnon.',
  },
  {
    id: 'sustainable-future',
    icon: ShieldCheck,
    title: 'Build a Sustainable Future',
    description: 'Support farmers, communities, and more sustainable resource use.',
  },
];

export default function BenefitsSection() {
  return (
    <section id="about" className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Turning Waste Into Opportunity
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Sagip-Ani helps agricultural communities make better use of materials that are often treated as waste.
          </p>
        </div>

        {/* 4 Benefit Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.id}
                className="group p-6 rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all duration-200 flex flex-col items-start"
              >
                {/* Icon Container with Light Green Background */}
                <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-emerald-100 transition-all duration-200">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-900 transition-colors">
                  {benefit.title}
                </h3>
                
                <p className="text-sm text-gray-600 leading-relaxed font-normal">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

