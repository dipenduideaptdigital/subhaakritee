import React from 'react';
import { resolveAssetUrl } from '../../utils/assetResolver';

const TimelineBlock = ({ badgeText, title, items = [] }) => {
  
  const renderTitle = (titleText) => {
    if (!titleText) return null;
    
    const lines = titleText.split(/\\n|\n/);
    
    return lines.map((line, index) => {
      const parts = line.split(/(\[[^\]]+\])/g);
      return (
        <React.Fragment key={index}>
          {parts.map((part, i) => {
            if (part.startsWith('[') && part.endsWith(']')) {
              return (
                <span key={i} className="text-[#ffc300]">
                  {part.slice(1, -1)}
                </span>
              );
            }
            return <React.Fragment key={i}>{part}</React.Fragment>;
          })}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <section className="py-20 lg:py-24 bg-white font-['Outfit',sans-serif] overflow-hidden">
      <div className="container mx-auto max-w-[1300px] px-6 lg:px-8">
        
        {/* Header Grid: Left Badge, Right Title */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-12 mb-12 lg:mb-16 text-left font-['Outfit',sans-serif]">
          {/* Tagline Badge */}
          <div className="shrink-0">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-200 bg-white">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-gray-600 font-['Helvetica',sans-serif]">
                {badgeText || 'GET IN TOUCH'}
              </span>
            </div>
          </div>

          {/* Main Title */}
          <div className="max-w-4xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold leading-[1.15] tracking-tight font-['Outfit',sans-serif] text-gray-900">
              {renderTitle(title || 'Our History [Is Full Of]\n[Interesting] Stages And\nEvents.')}
            </h2>
          </div>
        </div>

        {/* DESKTOP HORIZONTAL TIMELINE (Visible only on lg screen) */}
        <div className="hidden lg:block mt-20 lg:mt-24 relative w-full overflow-x-auto hide-scrollbar pb-10 pl-2 lg:pl-10">
          <div className="relative flex items-start gap-[50px] lg:gap-[65px] min-w-[1100px]">
            <div className="absolute left-0 w-full h-[2px] bg-gray-200 z-0" style={{ top: '196px' }}></div>
            
            {items.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center w-[170px] relative z-10 shrink-0">
                <div className="w-[160px] h-[160px] rounded-[36px] overflow-hidden bg-zinc-50 shrink-0">
                  <img
                    src={resolveAssetUrl(item.image, '/default-project.png')}
                    alt={`History ${item.year}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="h-[30px] w-full"></div>
               <div className="w-[12px] h-[12px] rounded-full bg-[#ffc300] shrink-0 ring-4 ring-white"></div>
                <div className="h-[25px] w-full"></div>
                
                <div className="w-full flex flex-col items-start px-1 font-['Outfit',sans-serif]">
                  <h3 className="text-[35px] lg:text-[42px] font-bold text-[#111827] leading-none mb-3 font-['Outfit',sans-serif]">
                    {item.year}
                  </h3>
                  <p className="text-[15px] lg:text-[16px] text-gray-600 leading-[1.2] font-normal text-left font-['Outfit',sans-serif]">
                    {item.description || 'A business house born out of passion for fish keeping and nature conservation'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE VERTICAL TIMELINE (Visible only on mobile/tablet) */}
        <div className="mt-10 lg:hidden relative w-full pr-2">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[23px] sm:left-[31px] top-6 bottom-6 w-[2px] bg-gray-200 z-0"></div>

          <div className="flex flex-col gap-8">
            {items.map((item, idx) => (
              <div key={idx} className="flex flex-col relative pl-12 sm:pl-16 w-full font-['Outfit',sans-serif]">
                {/* Timeline Dot */}
                <div className="absolute left-[18px] sm:left-[26px] top-1/2 transform -translate-y-1/2 w-[12px] h-[12px] rounded-full bg-[#ffc300] z-10 ring-4 ring-white"></div>

                {/* Content Card */}
                <div className="w-full flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 bg-gray-50/50 p-4 sm:p-5 rounded-[24px] border border-gray-100 hover:border-gray-200 transition-all duration-300">
                  {/* Image */}
                  <div className="w-full h-[180px] sm:w-[120px] sm:h-[120px] rounded-[18px] sm:rounded-[22px] overflow-hidden bg-zinc-100 shrink-0">
                    <img
                      src={resolveAssetUrl(item.image, '/default-project.png')}
                      alt={`History ${item.year}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Text info */}
                  <div className="flex-grow text-center sm:text-left font-['Outfit',sans-serif]">
                    <h3 className="text-[28px] sm:text-[32px] font-bold text-[#111827] leading-none mb-2 mt-1 font-['Outfit',sans-serif]">
                      {item.year}
                    </h3>
                    <p className="text-[14px] text-gray-600 leading-[1.3] font-normal font-['Outfit',sans-serif]">
                      {item.description || 'A business house born out of passion for fish keeping and nature conservation'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TimelineBlock;