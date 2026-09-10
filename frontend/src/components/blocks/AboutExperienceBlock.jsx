import React from 'react';
import { ArrowRight } from 'lucide-react';
import { resolveAssetUrl } from '../../utils/assetResolver';

const AboutExperienceBlock = ({
  badgeText, title, yearsOfExperience, experienceTitle, 
  paragraph, buttonText, buttonLink, image1, image2
}) => {
  const resolvedImg1 = resolveAssetUrl(image1, '/default-project.png');
  const resolvedImg2 = resolveAssetUrl(image2, '/default-project.png');

  const renderTitle = (titleText) => {
    if (!titleText) return null;
    const parts = titleText.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-[#ffc300]">
            {part.slice(1, -1).split(/\\n|\n/).map((line, lIdx, arr) => (
              <React.Fragment key={lIdx}>
                {line}
                {lIdx < arr.length - 1 && (
                  <>
                    <span className="lg:hidden"> </span>
                    <br className="hidden lg:inline" />
                  </>
                )}
              </React.Fragment>
            ))}
          </span>
        );
      }
      return part.split(/\\n|\n/).map((line, lIdx, arr) => (
        <React.Fragment key={lIdx}>
          {line}
          {lIdx < arr.length - 1 && (
            <>
              <span className="lg:hidden"> </span>
              <br className="hidden lg:inline" />
            </>
          )}
        </React.Fragment>
      ));
    });
  };

  return (
    <section className="py-20 lg:py-24 bg-white font-helvetica">
      <div className="container mx-auto max-w-[1300px] px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-16">
          
          {/* LEFT SECTION */}
          <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 w-max mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-600 font-['Helvetica',sans-serif]">
                {badgeText || 'Started in 1989'}
              </span>
            </div>

            <h2 className="text-[26px] xs:text-[30px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-bold leading-[1.1] tracking-[-0.03em] text-[#111827] whitespace-normal lg:whitespace-nowrap">
              {renderTitle(title || 'We Shape [Interior Designs,]\n[Crafting Timeless] And Inspiring\nSpaces')}
            </h2>

            {/* DESKTOP ROW */}
            <div className="hidden lg:flex flex-row items-stretch gap-6 lg:gap-10 mt-10 lg:mt-16">
              <div className="flex flex-col justify-start py-2 lg:py-4 gap-4">
                <div className="text-[120px] sm:text-[160px] lg:text-[260px] font-black leading-[0.75] tracking-[-0.06em] text-[#111827] -ml-2 lg:-ml-3 scale-y-125 origin-center">
                  {yearsOfExperience || '26'}
                </div>
                <div className="text-right pt-15">
                  <h3 className="text-[18px] lg:text-[22px] font-bold leading-[1] text-[#111827] whitespace-pre-line">
                    {experienceTitle || 'Years Of\nExperience'}
                  </h3>
                </div>
              </div>
              
              <div className="w-[160px] sm:w-[220px] lg:w-[360px] h-[240px] sm:h-[300px] lg:h-[460px] rounded-[28px] overflow-hidden shrink-0 mt-auto">
                <img 
                  src={resolvedImg1} 
                  alt="Experience Main" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

            {/* MOBILE ROW */}
            <div className="lg:hidden flex flex-row items-center justify-between gap-4 sm:gap-6 mt-10 w-full">
              <div className="flex flex-col justify-center items-center py-2 gap-2 text-center w-1/3">
                <div className="text-[64px] sm:text-[90px] font-black leading-[0.75] tracking-[-0.06em] text-[#111827] scale-y-125 origin-center">
                  {yearsOfExperience || '26'}
                </div>
                <div className="text-center mt-2">
                  <h3 className="text-[11px] sm:text-[14px] font-bold leading-[1.1] text-[#111827] whitespace-pre-line">
                    {experienceTitle || 'Years Of\nExperience'}
                  </h3>
                </div>
              </div>
              <div className="w-1/3 aspect-[3/4] rounded-2xl overflow-hidden shadow-sm">
                <img src={resolvedImg1} alt="Experience Main" className="w-full h-full object-cover" />
              </div>
              <div className="w-1/3 aspect-[3/4] rounded-2xl overflow-hidden shadow-sm">
                <img src={resolvedImg2} alt="Experience Secondary" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="w-full lg:w-[45%] flex flex-col justify-start items-center lg:items-start text-center lg:text-left mt-8 lg:mt-0">
            <div className="hidden lg:block w-full max-w-[460px] ml-auto rounded-[28px] overflow-hidden">
              <img 
                src={resolvedImg2} 
                alt="Experience Secondary" 
                className="w-full h-full object-cover" 
              />
            </div>

            <div className="w-full max-w-[460px] lg:ml-auto lg:mt-5 flex flex-col items-center lg:items-start">
              
              <div 
                className="font-['Outfit',sans-serif] text-[#4B5563] leading-relaxed text-[16px] pr-2 text-center lg:text-left prose prose-sm max-w-none prose-p:my-2 prose-strong:font-bold prose-a:text-blue-500"
                dangerouslySetInnerHTML={{ 
                  __html: paragraph || '<p>We believe that every space has the power to inspire, and that great design brings that inspiration to life. Our mission is to craft environments that stir creativity, evoke emotion, and reflect the essence of those who inhabit them.</p>' 
                }}
              />
              
              <a href={buttonLink || '#'} className="mt-8 lg:mt-10 group flex items-center border border-gray-300 rounded-full pl-7 pr-2 py-2 w-max hover:border-[#ffc300] transition-colors duration-300 font-['Outfit',sans-serif]">
                <span className="font-['Outfit',sans-serif] font-semibold text-[15px] text-[#111827] group-hover:text-[#ffc300] transition-colors">
                  {buttonText || 'Learn More'}
                </span>
                <div className="ml-5 w-10 h-10 rounded-full bg-[#ffc300] flex items-center justify-center group-hover:bg-[#e6b000] transition-colors">
                  <ArrowRight size={16} className="text-white transform group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutExperienceBlock;