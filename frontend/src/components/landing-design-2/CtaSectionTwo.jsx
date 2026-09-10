import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { renderTitle } from '../../utils/titleRenderer';

const CtaSectionTwo = ({ data, onCtaClick }) => {
  const badgeText = data?.badgeText || "GET IN TOUCH";
  const buttonText = data?.buttonText || "BOOK A FREE CONSULTATION";

  return (
    <section id="cta" className="py-20 md:py-24 bg-white text-gray-900 font-helvetica overflow-hidden select-none border-t border-gray-100">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl">
        
        {/* Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-8 lg:gap-12 items-start text-left">
          
          {/* Left Column: Badge */}
          <div className="shrink-0">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300 bg-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] md:text-[11px] font-bold tracking-widest text-gray-700 uppercase font-['Helvetica',sans-serif]">
                {badgeText}
              </span>
            </div>
          </div>

          {/* Right Column: Title and CTA Button */}
          <div className="flex flex-col items-start max-w-4xl font-['Helvetica',sans-serif]">
            {/* Double Line Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-gray-950 tracking-tight leading-[1.12] mb-10 font-['Helvetica',sans-serif]">
              {renderTitle(data?.title || 'Have A Project In [Mind?] Let’s\n[Make] It Happen')}
            </h2>

            {/* CTA Button */}
            <button 
              onClick={onCtaClick}
              className="group inline-flex items-center space-x-4 pl-6 pr-2 py-2 border border-gray-300 hover:border-gray-500 rounded-full text-xs md:text-sm font-bold tracking-wide text-gray-800 bg-white transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.02)] cursor-pointer font-['Helvetica',sans-serif]"
            >
              <span className="font-['Helvetica',sans-serif]">{buttonText}</span>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#ffc300] flex items-center justify-center text-black transition-transform group-hover:scale-105">
                <ArrowUpRight className="w-4.5 h-4.5 md:w-5 md:h-5" />
              </div>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CtaSectionTwo;