import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { resolveAssetUrl } from '../../utils/assetResolver';

const AboutGalleryBlock = ({ backgroundImage, badgeText, title, description, galleryItems = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(4); 
  const [isTransitioning, setIsTransitioning] = useState(true);

  const items = galleryItems.length > 0 ? galleryItems : [
    { title: 'Title', image: '' },
    { title: 'Title', image: '' },
    { title: 'Title', image: '' },
    { title: 'Title', image: '' },
  ];

  const tripledData = [...items, ...items, ...items];

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

  const handleNext = () => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    const total = items.length;
    if (total === 0) return;
    
    if (currentIndex >= total * 2) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(currentIndex - total);
      }, 700); 
      return () => clearTimeout(timer);
    } else if (currentIndex < total) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(currentIndex + total);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, items.length]);

  useEffect(() => {
    if (!isTransitioning) {
      const frame = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [isTransitioning]);

  // Card width 180px + Gap 18px = 198px per card step
  const cardStep = 198;
  const translateXValue = `translateX(-${currentIndex * cardStep}px)`;

  return (
    <section className="relative w-full py-20 font-['Outfit',sans-serif] overflow-hidden flex flex-col justify-center min-h-[650px] lg:min-h-[750px]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={resolveAssetUrl(backgroundImage, '/default-bg.png')}
          alt="Gallery Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12 ml-10 mt-3">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 w-full">

          {/* LEFT COLUMN: TEXT */}
          <div className="w-full lg:w-[32%] flex flex-col justify-center items-center lg:items-start text-center lg:text-left shrink-0">
            {/* Badge */}
            <div className="inline-flex items-center ml-5 gap-2 border border-white/40 rounded-full px-4 py-1.5 mb-6 w-fit bg-white/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white font-['Helvetica',sans-serif]">
                {badgeText || 'OUR GALLERY'}
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl ml-5 lg:text-[68px] font-black text-white font-['Outfit',sans-serif]  leading-[1.1] tracking-tight mb-5">
              {renderTitle(title || 'Interior\nDesign')}
            </h2>

            <div 
              className="text-[14px] lg:text-[15px] text-white/90 leading-relaxed max-w-[340px]  ml-5 font-normal font-['Outfit',sans-serif] prose prose-sm prose-invert max-w-none prose-p:my-1"
              dangerouslySetInnerHTML={{ 
                __html: description || '<p>Lorem ipsum dolor sit amet consectetur. Magna nunc porttitor convallis faucibus laoreet.</p>' 
              }}
            />
          </div>

          {/* RIGHT COLUMN: SLIDER WITH EXACTLY 4 CARDS VISIBLE */}
          <div className="w-full lg:w-auto max-w-[774px] overflow-hidden mt-8 ml-8 lg:mt-0">
            <div 
              className="flex gap-[18px]"
              style={{ 
                transform: translateXValue,
                transition: isTransitioning ? 'transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
              }}
            >
              {tripledData.map((item, index) => (
                <div
                  key={`${index}`}
                  className="flex-shrink-0 flex flex-col group cursor-pointer w-[180px]"
                >
                  <div className="overflow-hidden rounded-[24px] w-full h-[270px] relative shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 group-hover:border-white/40">
                    <img
                      src={resolveAssetUrl(item.image, '/default-gallery.png')}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 bg-white/10"
                    />
                  </div>
                  <h4 className="text-center text-white font-bold text-[16px] lg:text-[18px] mt-3 font-['Outfit',sans-serif]">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* CENTERED BUTTONS BELOW THE COLUMNS */}
        <div className="flex items-center justify-center gap-4 mt-12 lg:mt-14 z-20">
          <button
            onClick={handlePrev}
            aria-label="Previous"
            className="w-11 h-11 rounded-full border border-white/60 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer active:scale-95 bg-black/20 backdrop-blur-sm"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next"
            className="w-11 h-11 rounded-full border border-white/60 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer active:scale-95 bg-black/20 backdrop-blur-sm"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutGalleryBlock;