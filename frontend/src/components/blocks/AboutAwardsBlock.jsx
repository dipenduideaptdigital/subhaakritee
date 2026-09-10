import React, { useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { resolveAssetUrl } from '../../utils/assetResolver';

const AboutAwardsBlock = ({ badgeText, title, mainImage, awards = [] }) => {
  const awardsList = awards.length > 0 ? awards : [
    { year: '2020', title: 'Residential Interior Design' },
    { year: '2021', title: 'Outdoor & Landscape Design' },
    { year: '2022', title: 'Interior Design Consultation' },
    { year: '2023', title: 'Commercial Interior Design' },
    { year: '2024', title: 'Renovation And Remodeling' },
    { year: '2025', title: 'Interior 2D/3D Layouts' },
  ];

  const [activeAward, setActiveAward] = useState(awardsList[0].year);
  
  const renderTitle = (titleText) => {
    if (!titleText) return null;
    const parts = titleText.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-[#ffc300]">
            {part.slice(1, -1).split(/\\n|\n/).map((line, lIdx, arr) => (
              <React.Fragment key={lIdx}>{line}{lIdx < arr.length - 1 && <br className="hidden md:block" />}</React.Fragment>
            ))}
          </span>
        );
      }
      return part.split(/\\n|\n/).map((line, lIdx, arr) => (
        <React.Fragment key={lIdx}>{line}{lIdx < arr.length - 1 && <br className="hidden md:block" />}</React.Fragment>
      ));
    });
  };

  return (
    <section className="py-15 lg:py-10 mb-5 bg-white font-['Outfit',sans-serif] overflow-hidden">
      <div className="container mx-auto max-w-[1300px] px-6 lg:px-8">
        
        {/* Header Grid: Left Badge, Right Title */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-12 mb-12 lg:mb-16 text-left font-['Outfit',sans-serif]">
          {/* Tagline Badge */}
          <div className="shrink-0">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-200 bg-white">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-gray-600 font-['Helvetica',sans-serif]">
                {badgeText || 'AWARD & ACHIEVEMENT'}
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="max-w-4xl">
            <h2 className="text-3xl sm:text-4xl ml-20 mb-5 md:text-5xl lg:text-[54px] font-bold leading-[1.15] tracking-tight font-['Outfit',sans-serif] text-gray-900">
              {renderTitle(title || 'Design That [Speaks Our]\n[Industry] Awards')}
            </h2>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center">
          
          {/* Award Image */}
          <div className="w-full max-w-[500px] lg:max-w-[500px] aspect-square rounded-[36px] overflow-hidden shadow-sm bg-zinc-50 mx-auto lg:mx-0">
            <img
              src={resolveAssetUrl(mainImage, '/default-award.png')}
              alt="Awards and Achievements"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>

          {/* Awards Compact List (Figma / Second Frame Design) */}
          <div className="w-full flex flex-col border-t-2 border-[#ffc300] font-['Helvetica',sans-serif]">
            {awardsList.map((award, index) => {
              const isActive = activeAward === award.year;

              return (
                <div
                  key={index}
                  className="group flex items-center justify-between py-2 lg:py-2.5 cursor-pointer transition-colors border-b border-gray-400/60 hover:bg-gray-50/50 px-2"
                  onMouseEnter={() => setActiveAward(award.year)}
                  onClick={() => setActiveAward(award.year)}
                >
                  <div className="flex items-center space-x-6 md:space-x-10 transform group-hover:translate-x-1.5 transition-transform duration-300">
                    <span className="text-[13px] sm:text-[15px] font-normal text-gray-700 w-12 sm:w-16 shrink-0 text-left font-['Helvetica',sans-serif]">
                      {award.year}
                    </span>
                    <span className="text-[15px] sm:text-[17px] lg:text-[18px] font-bold text-gray-900 leading-tight capitalize text-left font-['Helvetica',sans-serif]">
                      {award.title}
                    </span>
                  </div>

                  {isActive ? (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#ffc300] flex items-center justify-center text-black shrink-0 shadow-sm">
                      <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={2.5} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-gray-800 group-hover:bg-gray-100 transition-colors shrink-0">
                      <ArrowUpRight className="w-5 h-5" strokeWidth={2} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutAwardsBlock;