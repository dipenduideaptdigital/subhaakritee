import React from 'react';
import { ArrowDown } from 'lucide-react';
import defaultBg from '../../assets/homepage/landing_page.png';
import { renderTitle } from '../../utils/titleRenderer';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const HeroSectionTwo = ({ data, onScrollDown }) => {
  const bgImage = data?.backgroundImage ? getAssetUrl(data.backgroundImage) : defaultBg;

  return (
    <div 
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col justify-between font-helvetica overflow-hidden select-none"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/35 z-0"></div>

      {/* Main Content Container */}
      <div className="relative z-10 flex-grow container mx-auto px-6 md:px-12 lg:px-20 flex flex-col justify-center pt-32 pb-4">
        <div className="max-w-3xl text-left">
          {/* Tagline / Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-6 animate-fade-in-down">
            <span className="w-2 h-2 rounded-full bg-[#ffc300]"></span>
            <span className="text-[10px] md:text-xs font-semibold tracking-widest uppercase text-white/90">
              {data?.badgeText || 'FAST AND RELIABLE'}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-[70px] font-bold text-white tracking-tight leading-[1.08] mb-6 font-helvetica">
            {renderTitle(data?.title || 'Find Your [Inspired]\n[Interior] Design', 'text-[#ffc300]')}
          </h1>

          <div 
            className="text-white/85 text-sm md:text-base lg:text-lg max-w-[460px] font-normal leading-relaxed mb-8 md:mb-12 [&>p]:mb-3 last:[&>p]:mb-0 [&_strong]:text-white [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ 
              __html: data?.description || '<p>Transform your vision into reality with our innovative designs, creating modern spaces that blend functionality, aesthetics, and sustainability.</p>' 
            }}
          />
        </div>
      </div>

      {/* Bottom Area containing Divider, Watermark, and Circle Button */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 pb-16 md:pb-20">
        {/* Horizontal Divider Line */}
        <div className="w-full h-[1px] bg-white/15 mb-6"></div>

        {/* Outer Flex Container for Circular Button and Watermark */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
          
          {/* Start Project Circle Button */}
          <div className="relative z-20">
            <div 
              className="group w-32 h-32 md:w-36 md:h-36 lg:w-[150px] lg:h-[150px] rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex flex-col items-center justify-center text-white cursor-pointer hover:bg-[#ffc300]/20 hover:border-[#ffc300]/50 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl"
              onClick={onScrollDown}
            >
              <div className="font-['Outfit'] text-[24px] md:text-[30px] lg:text-[27px] font-semibold leading-[30px] md:leading-[34px] lg:leading-[39px] text-white group-hover:text-[#ffc300] text-center tracking-normal select-none transition-colors duration-300">
                Start<br />Project
              </div>
            </div>
          </div>

              {/* Watermark placeholder */}
          
        </div>
      </div>

      {/* Subtle Scroll Down Indicator */}
      <div className="absolute bottom-6 right-6 md:right-12 z-20">
        <button 
          onClick={onScrollDown}
          className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          aria-label="Scroll Down"
        >
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>

      {/* Large Watermark Text */}
      <div className="absolute -bottom-6 md:-bottom-10 lg:-bottom-12 left-1/2 -translate-x-1/2 select-none pointer-events-none z-[1] overflow-hidden w-full text-right max-w-[1440px] pl-6 mb-12 ml-0 md:ml-10">
        <h2 className="whitespace-nowrap text-[50px] sm:text-[100px] md:text-[150px] lg:text-[160px] xl:text-[230px] font-bold text-white/20 tracking-[0.08em] font-serif leading-none">
          {data?.watermarkText || 'Interior'}
        </h2>
      </div>
    </div>
  );
};

export default HeroSectionTwo;