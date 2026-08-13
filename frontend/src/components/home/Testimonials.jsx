import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import apiClient from '../../api/client';
import { resolveAssetUrl } from '../../utils/assetResolver';
import team from '../../assets/homepage/review.jpg'; 
import defaultLogo from '../../assets/logos/LOGO.png';

const defaultAuthorImg = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop";
const defaultLogos = ['', '', '', '', ''];

const defaultTestimonials = [
  {
    type: 'residential',
    badgeText: "OUR CLIENTS SAY",
    title: "Here's What [Warm Words] \n [Our Clients] Say",
    description: "Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces to functional and stylish interiors.",
    ratingValue: "4.80",
    reviewCount: "2,688 Reviews",
    conceptText: "From Concept To Reality, The Team Turned My Vision Into A Stunning, Livable Space. I Couldn't Be Happier With This!",
    mainQuote: "I absolutely love my new modern living room! The clean lines, neutral tones, and minimalist interior create such a calming & stylish atmosphere. Highly recommend their modern interior design services!",
    authorName: "Morgan Dufresne",
    authorRole: "Homeowner",
    image: team,
    authorImage: defaultAuthorImg,
    logos: ['', '', '', '', '']
  },
  {
    type: 'office',
    badgeText: "OUR CLIENTS SAY",
    title: "Here's What [Warm Words] \n [Our Clients] Say",
    description: "Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces to functional and stylish interiors.",
    ratingValue: "4.90",
    reviewCount: "1,420 Reviews",
    conceptText: "Design. Build. Deliver. Everything our office needed—handled end to end.",
    mainQuote: "It is a pleasure to work with subhAAkritee. Together we created our office interior decoration. The interior designing, planning and decoration is just GREAT! All members are cooperative.",
    authorName: "Tanmoy",
    authorRole: "Company owner",
    image: team,
    authorImage: defaultAuthorImg,
    logos: ['', '', '', '', '']
  },
  {
    type: 'architecture',
    badgeText: "OUR CLIENTS SAY",
    title: "Here's What [Warm Words] \n [Our Clients] Say",
    description: "Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces to functional and stylish interiors.",
    ratingValue: "4.95",
    reviewCount: "850 Reviews",
    conceptText: "From dream homes to dynamic business spaces, they create architecture that reflects your vision.",
    mainQuote: "They delivered outstanding architectural planning. The space layout and structural designs are perfect. Exceeded our expectations at every level of the project.",
    authorName: "Rajesh Kumar",
    authorRole: "Property Developer",
    image: team,
    authorImage: defaultAuthorImg,
    logos: ['', '', '', '', '']
  }
];

const Testimonials = ({ data: externalData }) => {
  const [testimonialsList, setTestimonialsList] = useState(defaultTestimonials);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [logoIndex, setLogoIndex] = useState(0);
  const [logoTransition, setLogoTransition] = useState(true);

  useEffect(() => {
    if (externalData) {
      setTestimonialsList([{
        type: 'external',
        isVisible: externalData.isVisible,
        badgeText: externalData.badgeText || "OUR CLIENTS SAY",
        title: externalData.title || "Here's What [Warm Words] \n [Our Clients] Say",
        description: externalData.description || "Our portfolio showcases a diverse range of projects...",
        ratingValue: externalData.ratingValue || "4.80",
        reviewCount: externalData.reviewCount || "2,688 Reviews",
        conceptText: externalData.conceptText || "From Concept To Reality...",
        mainQuote: externalData.mainQuote || "I absolutely love my new modern living room!",
        authorName: externalData.authorName || "Morgan Dufresne",
        authorRole: externalData.authorRole || "Company owner",
        image: externalData.image || team,
        authorImage: externalData.authorImage || defaultAuthorImg,
        logos: externalData.logos || []
      }]);
      return;
    }

    const fetchAllTestimonials = async () => {
      let residential = null;
      let office = null;
      let architecture = null;

      try {
        const res = await apiClient.get('/cms/section/homepage_testimonials');
        if (res.data?.success && res.data?.data?.content) {
          residential = res.data.data.content;
        }
      } catch (err) {
        console.error('Failed to fetch residential testimonials:', err);
      }

      try {
        const res = await apiClient.get('/pages/office');
        if (res.data?.success && res.data?.data?.content?.blocks) {
          const block = res.data.data.content.blocks.find(b => b.type === 'testimonialsTwo' || b.type === 'testimonials');
          if (block) office = block.data;
        }
      } catch (err) {
        console.error('Failed to fetch office testimonials:', err);
      }

      try {
        const res = await apiClient.get('/pages/architecture');
        if (res.data?.success && res.data?.data?.content?.blocks) {
          const block = res.data.data.content.blocks.find(b => b.type === 'testimonialsTwo' || b.type === 'testimonials');
          if (block) architecture = block.data;
        }
      } catch (err) {
        console.error('Failed to fetch architecture testimonials:', err);
      }

      const serverUrl = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
        : 'http://localhost:5000';

      const resolveUrl = (path, fallback) => {
        if (!path) return fallback;
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        return `${serverUrl}${path}`;
      };

      const list = [
        {
          type: 'residential',
          isVisible: residential?.isVisible,
          badgeText: residential?.badgeText || defaultTestimonials[0].badgeText,
          title: residential?.title || defaultTestimonials[0].title,
          description: residential?.description || defaultTestimonials[0].description,
          ratingValue: residential?.items?.[0]?.ratingValue || residential?.ratingValue || defaultTestimonials[0].ratingValue,
          reviewCount: residential?.items?.[0]?.reviewCount || residential?.reviewCount || defaultTestimonials[0].reviewCount,
          conceptText: residential?.items?.[0]?.conceptText || residential?.conceptText || defaultTestimonials[0].conceptText,
          mainQuote: residential?.items?.[0]?.mainQuote || residential?.mainQuote || defaultTestimonials[0].mainQuote,
          authorName: residential?.items?.[0]?.authorName || residential?.authorName || defaultTestimonials[0].authorName,
          authorRole: residential?.items?.[0]?.authorRole || residential?.authorRole || defaultTestimonials[0].authorRole,
          image: resolveUrl(residential?.items?.[0]?.image || residential?.image, defaultTestimonials[0].image),
          authorImage: resolveUrl(residential?.items?.[0]?.authorImage || residential?.authorImage, defaultTestimonials[0].authorImage),
          logos: residential?.logos || defaultTestimonials[0].logos,
          bottomText: residential?.bottomText || defaultTestimonials[0].bottomText
        },
        {
          type: 'office',
          badgeText: residential?.badgeText || office?.badgeText || defaultTestimonials[1].badgeText,
          title: residential?.title || office?.title || defaultTestimonials[1].title,
          description: residential?.description || office?.description || defaultTestimonials[1].description,
          ratingValue: residential?.items?.[1]?.ratingValue || office?.ratingValue || defaultTestimonials[1].ratingValue,
          reviewCount: residential?.items?.[1]?.reviewCount || office?.reviewCount || defaultTestimonials[1].reviewCount,
          conceptText: residential?.items?.[1]?.conceptText || office?.conceptText || defaultTestimonials[1].conceptText,
          mainQuote: residential?.items?.[1]?.mainQuote || office?.mainQuote || defaultTestimonials[1].mainQuote,
          authorName: residential?.items?.[1]?.authorName || office?.authorName || defaultTestimonials[1].authorName,
          authorRole: residential?.items?.[1]?.authorRole || office?.authorRole || defaultTestimonials[1].authorRole,
          image: resolveUrl(residential?.items?.[1]?.image || office?.image, defaultTestimonials[1].image),
          authorImage: resolveUrl(residential?.items?.[1]?.authorImage || office?.authorImage, defaultTestimonials[1].authorImage),
          logos: residential?.logos || office?.logos || defaultTestimonials[1].logos,
          bottomText: residential?.bottomText || office?.bottomText || defaultTestimonials[1].bottomText
        },
        {
          type: 'architecture',
          badgeText: residential?.badgeText || architecture?.badgeText || defaultTestimonials[2].badgeText,
          title: residential?.title || architecture?.title || defaultTestimonials[2].title,
          description: residential?.description || architecture?.description || defaultTestimonials[2].description,
          ratingValue: residential?.items?.[2]?.ratingValue || architecture?.ratingValue || defaultTestimonials[2].ratingValue,
          reviewCount: residential?.items?.[2]?.reviewCount || architecture?.reviewCount || defaultTestimonials[2].reviewCount,
          conceptText: residential?.items?.[2]?.conceptText || architecture?.conceptText || defaultTestimonials[2].conceptText,
          mainQuote: residential?.items?.[2]?.mainQuote || architecture?.mainQuote || defaultTestimonials[2].mainQuote,
          authorName: residential?.items?.[2]?.authorName || architecture?.authorName || defaultTestimonials[2].authorName,
          authorRole: residential?.items?.[2]?.authorRole || architecture?.authorRole || defaultTestimonials[2].authorRole,
          image: resolveUrl(residential?.items?.[2]?.image || architecture?.image, defaultTestimonials[2].image),
          authorImage: resolveUrl(residential?.items?.[2]?.authorImage || architecture?.authorImage, defaultTestimonials[2].authorImage),
          logos: residential?.logos || architecture?.logos || defaultTestimonials[2].logos,
          bottomText: residential?.bottomText || architecture?.bottomText || defaultTestimonials[2].bottomText
        }
      ];

      setTestimonialsList(list);
    };

    fetchAllTestimonials();
  }, [externalData]);

  useEffect(() => {
    if (testimonialsList.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % testimonialsList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonialsList, isPaused]);

  useEffect(() => {
    const logoInterval = setInterval(() => {
      setLogoIndex(prev => prev + 1);
    }, 2000);
    return () => clearInterval(logoInterval);
  }, []);

  const handleLogoTransitionEnd = () => {
    if (logoIndex >= 5) {
      setLogoTransition(false);
      setLogoIndex(0);
    }
  };

  useEffect(() => {
    if (!logoTransition) {
      const frameId = requestAnimationFrame(() => {
        setLogoTransition(true);
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [logoTransition]);

  const activeSlide = testimonialsList[activeIdx] || defaultTestimonials[0];

  const badgeText = activeSlide.badgeText;
  const title = activeSlide.title;
  const description = activeSlide.description;
  const ratingValue = activeSlide.ratingValue;
  const reviewCount = activeSlide.reviewCount;
  const conceptText = activeSlide.conceptText;
  const mainQuote = activeSlide.mainQuote;
  const authorName = activeSlide.authorName;
  const authorRole = activeSlide.authorRole;
  const bottomText = activeSlide.bottomText || "Our Website [75000+] VIP Customer";

  const rawLogos = (Array.isArray(activeSlide.logos) && activeSlide.logos.length > 0) ? activeSlide.logos : defaultLogos;
  const activeLogos = [...rawLogos, '', '', '', '', ''].slice(0, 5); 
  const trackLogos = [...activeLogos, ...activeLogos];

  const renderTitle = (titleText) => {
    if (!titleText) return null;
    const parts = titleText.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-[#3B82F6]">
            {part.slice(1, -1).split(/\\n|\n/).map((line, lIdx, arr) => (
              <React.Fragment key={lIdx}>
                {line}
                {lIdx < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        );
      }
      return part.split(/\\n|\n/).map((line, lIdx, arr) => (
        <React.Fragment key={lIdx}>
          {line}
          {lIdx < arr.length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };

  if (testimonialsList[0]?.isVisible === false) return null;

  return (
    <section 
      className="py-16 md:py-24 bg-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-6 md:px-8 max-w-[1400px]">
        
        {/* Header Area */}
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 mb-16 items-start">
          <div className="w-full lg:w-1/3 fadeInLeft">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                {badgeText}
              </span>
            </div>
          </div>
          
          <div className="w-full lg:w-2/3 flex flex-col items-start fadeInRight">
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              {renderTitle(title)}
            </h2>
            <div 
              className="text-gray-500 max-w-[540px] font-normal text-sm md:text-base leading-relaxed [&>p]:mb-2 last:[&>p]:mb-0"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </div>

        {/* Testimonials Body */}
        <div className="w-full mb-16 md:mb-24 flex items-center">
          <div 
            className="w-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-stretch"
          >
            
            <div className="w-full lg:w-[55%] h-[280px] sm:h-[380px] md:h-[450px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden fadeInLeft group shrink-0">
              <img 
                key={activeSlide.image}
                src={activeSlide.image} 
                alt="Office Interior" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 animate-in fade-in duration-500"
                onError={(e) => {
                  if (e.currentTarget.src !== team) {
                    e.currentTarget.src = team;
                  }
                }}
              />
            </div>

            <div className="w-full lg:w-[45%] flex flex-col justify-between h-[360px] sm:h-[400px] md:h-[450px] lg:h-[450px] shrink-0 fadeInRight">
              
              <div>
                <div className="flex flex-row items-center gap-3 sm:gap-6 mb-6">
                  <div className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tighter shrink-0">{ratingValue}</div>
                  
                  <div className="flex flex-col items-start gap-1 shrink-0">
                    <div className="bg-[#3B82F6] text-white flex space-x-1 px-2.5 sm:px-3 py-1 rounded-full shadow-md">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-white text-white" />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-900 pl-1">{reviewCount}</span>
                  </div>
                  
                  <div className="pl-3 sm:pl-6 border-l border-gray-200">
                    <p key={activeIdx} className="text-[11px] md:text-xs text-gray-700 font-bold leading-relaxed max-w-[280px] line-clamp-3 animate-in fade-in duration-500">
                      {conceptText}
                    </p>
                  </div>
                </div>
                
                <div className="w-full h-[1px] bg-gray-200 mb-6"></div>
              </div>

              <div className="my-auto py-1 sm:py-2 flex-1 overflow-y-auto hide-scrollbar">
                
                <div 
                  key={activeIdx} 
                  className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-[19px] font-normal leading-[1.65] max-w-[470px] animate-in fade-in duration-500 [&>p]:mb-2 last:[&>p]:mb-0"
                  dangerouslySetInnerHTML={{ __html: mainQuote }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4">
                <div key={activeIdx} className="flex items-center space-x-4 shrink-0 animate-in fade-in duration-500">
                  <img 
                    src={activeSlide.authorImage} 
                    alt={authorName} 
                    className="w-12 h-12 rounded-full object-cover shadow-sm shrink-0"
                    onError={(e) => {
                      if (e.currentTarget.src !== defaultAuthorImg) {
                        e.currentTarget.src = defaultAuthorImg;
                      }
                    }}
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-gray-900">{authorName}</span>
                    <span className="text-[10px] text-gray-400">{authorRole}</span>
                  </div>
                </div>

                {/* Slider Dots */}
                <div className="flex space-x-2 bg-gray-100 hover:bg-gray-200/80 px-4 py-2 rounded-full transition-colors w-fit shrink-0">
                  {testimonialsList.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIdx(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        activeIdx === idx ? 'w-6 bg-[#3B82F6]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Section - Logos Auto Slider */}
        <div className="pt-8 opal-move-up">
          <div className="flex items-center justify-center mb-10">
            <div className="h-px bg-gray-200 flex-grow max-w-[200px] lg:max-w-[400px]"></div>
            <h3 className="px-6 text-xl md:text-2xl font-bold text-gray-900 whitespace-nowrap">
              {renderTitle(bottomText)}
            </h3>
            <div className="h-px bg-gray-200 flex-grow max-w-[200px] lg:max-w-[400px]"></div>
          </div>

          <div className="w-full overflow-hidden px-4 md:px-8 pb-4">
            <div 
              className="flex w-full"
              style={{
                transform: `translateX(-${logoIndex * 20}%)`,
                transition: logoTransition ? 'transform 0.5s ease-in-out' : 'none'
              }}
              onTransitionEnd={handleLogoTransitionEnd}
            >
              {trackLogos.map((logo, index) => {
                const isUrl = logo && (logo.startsWith('/') || logo.startsWith('http'));
                const logoUrl = isUrl ? resolveAssetUrl(logo) : defaultLogo;
                
                return (
                  <div key={index} className="w-[20%] shrink-0 flex justify-center items-center px-2 md:px-4">
                    <img 
                      src={logoUrl}
                      alt={`Client Partner Logo`}
                      className="h-10 md:h-14 lg:h-16 w-auto object-contain"
                      onError={(e) => {
                        if (!e.currentTarget.src.includes('logo2.svg')) {
                          e.currentTarget.src = defaultLogo;
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;