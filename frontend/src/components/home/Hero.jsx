import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client'; 
import defaultHeroback from '../../assets/homepage/banner_back.png';
import defaultHerofront from '../../assets/homepage/banner_front.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const Hero = ({ data: externalData }) => {
  const [homeData, setHomeData] = useState(externalData || null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);

      try {
        if (externalData) {
          setHomeData(externalData);
        } else {
          const res = await apiClient.get('/cms/section/homepage_hero');
          if (res.data?.success && res.data?.data?.content) {
            setHomeData(res.data.data.content);
          }
        }
      } catch (err) {
        console.error('Failed to fetch home hero CMS:', err);
      }

      const slide1Data = homeData?.slide1 || {};
      const slide2Data = homeData?.slide2 || {};
      const slide3Data = homeData?.slide3 || {};

      const imagesToPreload = [
        slide1Data.backgroundImage ? getAssetUrl(slide1Data.backgroundImage) : defaultHeroback,
        slide1Data.frontImage ? getAssetUrl(slide1Data.frontImage) : defaultHerofront,
        slide2Data.backgroundImage ? getAssetUrl(slide2Data.backgroundImage) : defaultHeroback,
        slide2Data.frontImage ? getAssetUrl(slide2Data.frontImage) : defaultHerofront,
        slide3Data.backgroundImage ? getAssetUrl(slide3Data.backgroundImage) : defaultHeroback,
        slide3Data.frontImage ? getAssetUrl(slide3Data.frontImage) : defaultHerofront
      ];

      try {
        await Promise.all(imagesToPreload.filter(Boolean).map(url => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        }));
      } catch (preloadErr) {
        console.error('Error preloading slider images:', preloadErr);
      }

      setIsLoading(false);
    };

    fetchAllData();
  }, [externalData]);

  useEffect(() => {
    if (isLoading || isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, [isLoading, isPaused]);

  const handleScrollDown = () => {
    const nextSection = document.getElementById('services-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="relative h-[650px] lg:h-[750px] xl:h-[800px] w-full flex items-center justify-center overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"></div>
        <div className="z-10 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-white/70 tracking-widest text-sm uppercase">Loading Slider...</p>
        </div>
      </div>
    );
  }

  const defaultFallback = {
    badgeText: "Fast and Reliable",
    titleLine1: "End-to-end",
    titleLine2: "Interiors",
    subtitle: "<p>We specialize in transforming visions into reality. Explore our interior design projects crafted with precision.</p>",
    buttonText: "BOOK A FREE CONSULTATION",
    backgroundImage: defaultHeroback,
    frontImage: defaultHerofront,
    glassCardNumber: "250+",
    glassCardText1: "Lorem Ipsum Is Simply Dummy Text",
    glassCardText2: "There Is No One Who Loves Pain Itself",
  };

  const slides = [
    { data: homeData?.slide1 || {}, fallback: defaultFallback },
    { data: homeData?.slide2 || {}, fallback: defaultFallback },
    { data: homeData?.slide3 || {}, fallback: defaultFallback }
  ];

  return (
    <div 
      className="relative w-full h-[700px] sm:h-[750px] lg:h-[750px] xl:h-[800px] bg-zinc-900 overflow-hidden group select-none animate-in fade-in duration-700"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => {
        const isActive = index === activeSlide;
        const bgImage = slide.data?.backgroundImage ? getAssetUrl(slide.data.backgroundImage) : slide.fallback.backgroundImage;
        const frontImage = slide.data?.frontImage ? getAssetUrl(slide.data.frontImage) : slide.fallback.frontImage;

        return (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95 pointer-events-none'
            }`}
          >
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[5000ms] ease-out"
              style={{ 
                backgroundImage: `url(${bgImage})`,
                transform: isActive && !isPaused ? 'scale(1.05)' : 'scale(1.00)'
              }}
            >
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
            </div>

            {/* SHARED LAYOUT FOR ALL SLIDES (Glass Card Design) */}
            <div className="w-full h-full flex items-center justify-center relative z-10">
              <div className="w-full max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 pt-28 sm:pt-32 lg:pt-0 pb-12 lg:pb-0">
                <div className="flex flex-col lg:flex-row justify-between items-center w-full gap-8 lg:gap-8 pt-4 sm:pt-6 lg:pt-0">
                  
                  <div className="text-white max-w-xl lg:max-w-2xl xl:max-w-3xl flex flex-col items-start text-left w-full lg:w-auto">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-sm mt-2 sm:mt-0 mb-4 sm:mb-6 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                      <span className="text-[10px] uppercase tracking-wider font-medium text-white/90">
                        {slide.data?.badgeText || slide.fallback.badgeText}
                      </span>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl lg:text-[48px] xl:text-[62px] 2xl:text-[76px] font-bold leading-tight lg:leading-[54px] xl:leading-[68px] 2xl:leading-[82px] mb-4 md:mb-6 drop-shadow-lg font-helvetica">
                      <span className="tracking-normal block whitespace-nowrap">{slide.data?.titleLine1 || slide.fallback.titleLine1}</span>
                      <span className="tracking-normal block whitespace-nowrap">{slide.data?.titleLine2 || slide.fallback.titleLine2}</span>
                    </h1>
                    
                    {/* TipTap Editor HTML Rendering */}
                    <div 
                      className="text-sm md:text-lg text-gray-200 mb-8 md:mb-10 lg:max-w-[430px] font-light leading-relaxed ml-2 [&_p]:m-0 [&_a]:text-blue-400 hover:[&_a]:text-blue-300 [&_strong]:text-white [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                      dangerouslySetInnerHTML={{ __html: slide.data?.subtitle || slide.fallback.subtitle }}
                    />
                    
                    <Link to="/contact" className="group inline-flex items-center space-x-4 md:space-x-6 rounded-full border border-white/40 hover:border-white transition-all pl-5 md:pl-6 pr-2 py-2 ml-2">
                      <span className="text-xs md:text-sm font-medium tracking-wide">{slide.data?.buttonText || slide.fallback.buttonText}</span>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center text-white transition-transform group-hover:scale-105">
                        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                    </Link>
                  </div>

                  <div className="flex flex-row items-end justify-center lg:justify-end gap-6 shrink-0 w-full lg:w-auto mt-2 sm:mt-4 lg:mt-10 pb-1">
                    <div className="w-[200px] h-[200px] md:w-[240px] md:h-[240px] bg-[#3a3532]/40 backdrop-blur-[28px] border border-white/10 rounded-[24px] p-6 shadow-2xl z-20 flex flex-col justify-between shrink-0">
                      <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{slide.data?.glassCardNumber || slide.fallback.glassCardNumber}</h2>
                        <p className="text-xs text-gray-200 font-normal leading-relaxed">{slide.data?.glassCardText1 || slide.fallback.glassCardText1}</p>
                      </div>
                      <p className="text-sm text-white font-medium">{slide.data?.glassCardText2 || slide.fallback.glassCardText2}</p>
                    </div>

                    <div className="w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-[24px] overflow-hidden shadow-2xl z-10 border-2 border-white/10 shrink-0">
                      <img 
                        src={frontImage} 
                        alt="Hero Foreground" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          if (e.currentTarget.src !== defaultHerofront) e.currentTarget.src = defaultHerofront;
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        );
      })}

      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-40 left-1/2 -translate-x-1/2 z-20">
        <button 
          onClick={handleScrollDown}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer animate-bounce"
        >
          <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </button>
      </div>
    </div>
  );
};

export default Hero;