import React from 'react';
import { renderTitle } from '../../utils/titleRenderer';
import { resolveAssetUrl } from '../../utils/assetResolver';

// Import logos from assets/logos/
import aristoLogo from '../../assets/logos/aristo.png';
import spitzLogo from '../../assets/logos/spitz.png';
import faberLogo from '../../assets/logos/faber.png';
import everydayLogo from '../../assets/logos/everyday.png';
import fevicolLogo from '../../assets/logos/fevicol.png';
import urbanLogo from '../../assets/logos/urban.png';

const HappyCustomers = ({ data }) => {
  const fallbackList = [
    { name: 'Aristo', logo: aristoLogo, heightClass: 'h-11 md:h-[44px]' },
    { name: 'Spitze', logo: spitzLogo, heightClass: 'h-12 md:h-[48px]' },
    { name: 'Faber', logo: faberLogo, heightClass: 'h-11 md:h-[44px]' },
    { name: 'Everyday', logo: everydayLogo, heightClass: 'h-12 md:h-[48px]' },
    { name: 'Fevicol', logo: fevicolLogo, heightClass: 'h-[54px] md:h-[60px]' },
    { name: 'Urban Ladder', logo: urbanLogo, heightClass: 'h-11 md:h-[44px]' },
  ];

  const partnersList = data?.partners?.length > 0 
    ? data.partners.map((p, idx) => ({
        name: p.name || `Partner ${idx + 1}`,
        logo: resolveAssetUrl(p.logo, fallbackList[idx % fallbackList.length].logo),
        heightClass: p.heightClass || 'h-11 md:h-[44px]'
      }))
    : fallbackList;

  return (
    <section className="pt-6 pb-16 md:pt-8 md:pb-20 bg-white text-gray-900 font-helvetica overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl">
        
        {/* Centered Title with split horizontal line */}
        <div className="relative flex items-center justify-center mb-16 select-none">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200/80"></div>
          </div>
          <div className="relative bg-white px-8 md:px-12">
            <h2 className="text-sm md:text-[15px] font-bold tracking-[0.25em] text-gray-900 font-helvetica flex items-center gap-1.5 uppercase leading-none">
              {renderTitle(data?.title || 'OUR [HAPPY CUSTOMERS]', 'text-[#ffc300]')}
            </h2>
          </div>
        </div>

        {/* Center-Aligned Logos Grid/Flex Row */}
        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-12 md:gap-16 lg:gap-20 w-full select-none">
          {partnersList.map((partner, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity duration-300 pointer-events-auto"
            >
              <img 
                src={partner.logo} 
                alt={`${partner.name} Logo`} 
                className={`${partner.heightClass} w-auto object-contain transition-transform duration-300 hover:scale-105`}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HappyCustomers;