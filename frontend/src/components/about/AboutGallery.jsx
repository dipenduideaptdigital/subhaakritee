import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import bigImg from '../../assets/aboutUs/big.png';
import sm1 from '../../assets/aboutUs/sm1.png';
import sm2 from '../../assets/aboutUs/sm2.png';
import sm3 from '../../assets/aboutUs/sm3.png';
import sm4 from '../../assets/aboutUs/sm4.png';

const GALLERY_DATA = [
  { id: 1, src: sm1, title: 'Title' },
  { id: 2, src: sm2, title: 'Title' },
  { id: 3, src: sm3, title: 'Title' },
  { id: 4, src: sm4, title: 'Title' },
];

const AboutGallery = () => {
  const total = GALLERY_DATA.length;
  // We use 21 copies of the array. This creates a massive buffer on both sides.
  const extendedData = Array(21).fill(GALLERY_DATA).flat();

  // Start exactly in the middle block (the 10th copy)
  const [currentIndex, setCurrentIndex] = useState(total * 10);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Sync index if total items change
  useEffect(() => {
    setCurrentIndex(total * 10);
  }, [total]);

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    if (total === 0) return;
    
    // Calculate boundaries. We reset if they drift 3 blocks away from the center.
    const minBound = total * 7;
    const maxBound = total * 13;
    
    if (currentIndex >= maxBound || currentIndex <= minBound) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        // Snap perfectly back to the center block, keeping their exact relative position
        const offset = currentIndex % total;
        setCurrentIndex(total * 10 + offset);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, total]);

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
          src={bigImg}
          alt="Gallery Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 w-full">

          {/* LEFT COLUMN: TEXT */}
          <div className="w-full lg:w-[32%] flex flex-col justify-center items-center lg:items-start text-center lg:text-left shrink-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-white/40 rounded-full px-4 py-1.5 mb-6 w-fit bg-white/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white font-['Helvetica',sans-serif]">
                OUR GALLERY
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-black text-white font-['Outfit',sans-serif] leading-[1.1] tracking-tight mb-5">
              Interior<br />Design
            </h2>

            <p className="text-[14px] lg:text-[15px] text-white/90 leading-relaxed max-w-[340px] font-normal font-['Outfit',sans-serif]">
              Lorem ipsum dolor sit amet consectetur. Magna nunc porttitor convallis faucibus laoreet.
            </p>
          </div>

          {/* RIGHT COLUMN: SLIDER WITH EXACTLY 4 CARDS VISIBLE */}
          <div className="w-full lg:w-auto max-w-[774px] overflow-hidden mt-8 lg:mt-0">
            <div 
              className="flex gap-[18px]"
              style={{ 
                transform: translateXValue,
                transition: isTransitioning ? 'transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
              }}
            >
              {extendedData.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex-shrink-0 flex flex-col group cursor-pointer w-[180px]"
                >
                  {/* Card Container */}
                  <div className="overflow-hidden rounded-[24px] w-full h-[270px] relative shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 group-hover:border-white/40">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Title */}
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

export default AboutGallery;