import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { renderTitle } from '../../utils/titleRenderer';
import defaultBg from '../../assets/homepage/banner_back.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const StatsSectionTwo = ({ data, onCtaClick }) => {
  const bgImage = data?.backgroundImage ? getAssetUrl(data.backgroundImage) : defaultBg;

  const stats = data?.stats || [
    { value: '26+', title: 'YEARS EXPERIENCE', description: 'Improving homes with expert craftsmanship for years' },
    { value: '100', title: 'PROJECTS DONE', description: 'Over 250 successful projects delivered with quality and care' },
    { value: '100', title: 'SATISFIED CUSTOMER', description: 'Our team of 30 experts ensures top-quality results' },
    { value: '4+', title: 'LOCATION', description: 'All of our clients are satisfied with our work and service' },
  ];

  return (
    <section 
      className="relative py-20 md:py-28 bg-cover bg-center bg-no-repeat text-white overflow-hidden font-helvetica select-none"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Warm dark overlay for readability */}
      <div className="absolute inset-0 bg-black/55 z-0"></div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl flex flex-col justify-between h-full text-left">
        
        {/* Header Block */}
        <div className="flex flex-col items-start mb-16 md:mb-20 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffc300]"></span>
            <span className="text-[10px] md:text-[11px] font-bold tracking-widest text-white/95 uppercase">
              {data?.badgeText || 'TRUSTED EXPERIENCE'}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-[60px] font-bold leading-[1.12] tracking-tight font-helvetica text-white mb-2">
            {renderTitle(data?.title || 'Behind [Every Statistic]\n[Pulses] A Human Story', 'text-[#ffc300]')}
          </h2>
        </div>

        {/* Stats Row Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-16 md:mb-20 mt-10">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-start animate-fade-in-down">
              <span className="text-4xl md:text-5xl lg:text-[44px] font-bold text-[#ffc300] mb-4 leading-none tracking-tight">
                {stat.value}
              </span>
              <h4 className="text-[11px] md:text-xs font-bold tracking-widest text-white/90 uppercase mb-2.5">
                {stat.title}
              </h4>
              <p className="text-white/70 text-xs md:text-[13px] leading-relaxed max-w-[220px] font-normal">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="flex items-start">
          <button 
            onClick={onCtaClick}
            className="group inline-flex items-center space-x-4 pl-6 pr-2 py-2 border border-white/30 hover:border-white rounded-full text-xs md:text-sm font-semibold text-white bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 shadow-xl"
          >
            <span>{data?.buttonText || "BOOK A FREE CONSULTATION"}</span>
            <div className="w-8 h-8 rounded-full bg-[#ffc300] flex items-center justify-center text-black transition-transform group-hover:scale-110">
              <ArrowUpRight className="w-4.5 h-4.5" />
            </div>
          </button>
        </div>

      </div>
    </section>
  );
};

export default StatsSectionTwo;