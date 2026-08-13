import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import defaultServiceImg from '../../assets/homepage/service.png';
import defaultCountingImg from '../../assets/homepage/counting.png';
import apiClient from '../../api/client';

const defaultServicesList = [
  { id: '01', title: 'Residential Interior Design', link: '/services/residential-interior-design' },
  { id: '02', title: 'Outdoor & Landscape Design', link: '/services/outdoor-and-landscape-design' },
  { id: '03', title: 'Interior Design Consultation', link: '/services/interior-design-consultation' },
  { id: '04', title: 'Commercial Interior Design', link: '/services/commercial-interior-design' },
  { id: '05', title: 'Renovation And Remodeling', link: '/services/renovation-and-remodeling' },
  { id: '06', title: 'Interior 2D/3D Layouts', link: '/services/interior-2d-3d-layouts' },
];

const defaultStatsData = [
  { value: '26+', title: 'YEARS EXPERIENCE', description: 'Improving homes with expert craftsmanship for years' },
  { value: '100', title: 'PROJECTS DONE', description: 'Over 250 successful projects delivered with quality and care' },
  { value: '100', title: 'SATISFIED CUSTOMER', description: 'Our team of 30 experts ensures top-quality results' },
  { value: '4+', title: 'LOCATION', description: 'All of our clients are satisfied with our work and service' },
];

// Counting Animation Component
const AnimatedCounter = ({ text }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const numMatch = text.match(/\d+/);
    const targetNum = numMatch ? parseInt(numMatch[0], 10) : 0;

    if (!isVisible || targetNum === 0) return;

    let start = 0;
    const duration = 2000;
    const increment = targetNum / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetNum) {
        clearInterval(timer);
        setCount(targetNum);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, text]);

  const numMatch = text.match(/\d+/);
  const suffix = text.replace(/\d+/g, '');

  return (
    <span ref={ref}>
      {numMatch ? `${count}${suffix}` : text}
    </span>
  );
};

const OurServices = ({ data: externalData }) => {
  const navigate = useNavigate();
  const [activeService, setActiveService] = useState('01');
  const [content, setContent] = useState(externalData || null);
  const [serviceImg, setServiceImg] = useState(defaultServiceImg);
  const [countingImg, setCountingImg] = useState(defaultCountingImg);
  const [houseTranslateX, setHouseTranslateX] = useState(150);
  
  const imageContainerRef = useRef(null);

  const handleServiceClick = (service, serviceId) => {
    setActiveService(serviceId);
    const slug = service.title ? service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '';
    const targetLink = service.link || service.url || (slug ? `/services/${slug}` : '/services');
    navigate(targetLink);
  };

  useEffect(() => {
    let isMounted = true;

    const processContent = (fetchedContent) => {
      if (isMounted) setContent(fetchedContent);
      const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';

      if (fetchedContent.image) {
        const mainUrl = fetchedContent.image.startsWith('http') ? fetchedContent.image : `${serverUrl}${fetchedContent.image}`;
        const img1 = new Image();
        img1.src = mainUrl;
        img1.onload = () => { if (isMounted) setServiceImg(mainUrl); };
        img1.onerror = () => { if (isMounted) setServiceImg(defaultServiceImg); };
      } else if (isMounted) { setServiceImg(defaultServiceImg); }

      if (fetchedContent.bottomImage) {
        const bottomUrl = fetchedContent.bottomImage.startsWith('http') ? fetchedContent.bottomImage : `${serverUrl}${fetchedContent.bottomImage}`;
        const img2 = new Image();
        img2.src = bottomUrl;
        img2.onload = () => { if (isMounted) setCountingImg(bottomUrl); };
        img2.onerror = () => { if (isMounted) setCountingImg(defaultCountingImg); };
      } else if (isMounted) { setCountingImg(defaultCountingImg); }
    };

    if (externalData) {
      processContent(externalData);
      return () => { isMounted = false; };
    }

    const fetchServicesData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_our_services');
        const { data } = res;
        if (data.success && data.data?.content) {
          processContent(data.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch our services content:', error);
      }
    };

    fetchServicesData();

    return () => {
      isMounted = false;
    };
  }, [externalData]);

  useEffect(() => {
    const handleScroll = () => {
      if (!imageContainerRef.current) return;

      const rect = imageContainerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const totalDistance = windowHeight + rect.height;
        const currentScrolled = windowHeight - rect.top;
        let progress = currentScrolled / totalDistance;

        progress = Math.max(0, Math.min(1, progress));
        const targetX = 150 - (progress * 300);

        setHouseTranslateX(targetX);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const badgeText = content?.badgeText || "OUR SERVICES";
  const title = content?.title || "Explore Our [Comprehensive Interior Design] Services";
  const description = content?.description || "<p>We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.</p>";
  const servicesList = content?.services || defaultServicesList;
  const statsData = content?.stats || defaultStatsData;

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

  if (content?.isVisible === false) return null;
  
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-5 max-w-7xl">

        {/* Top Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_4.5fr] gap-8 md:gap-12 mb-12 md:mb-20 items-start">
          <div className="fadeInLeft">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                {badgeText}
              </span>
            </div>
          </div>

          <div className="fadeInRight">
            <h2 className="text-[40px] md:text-[50px] lg:text-[70px] font-bold tracking-[-0.04em] text-gray-900 mb-6 leading-[1.1] lg:leading-[73px] capitalize font-['Helvetica']">
              {renderTitle(title)}
            </h2>

            <div
              className="text-gray-500 max-w-3xl font-light text-sm md:text-base leading-relaxed prose prose-sm sm:prose-base max-w-none prose-p:m-0 prose-a:text-blue-500 hover:prose-a:text-blue-600 [&_strong]:text-gray-900 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </div>

        {/* Middle Section: Image & Services List */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1.35fr_1.15fr] gap-10 lg:gap-16 xl:gap-12 mb-24 md:mb-32 items-center">
          <div className="relative rounded-[37px] overflow-hidden h-[450px] lg:h-[544px] lg:max-w-[900px] w-full fadeInLeft group">
            <img
              src={serviceImg}
              alt="Interior Design Service"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                if (e.currentTarget.src !== defaultServiceImg) {
                  e.currentTarget.src = defaultServiceImg;
                }
              }}
            />
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-[85%] max-w-[450px] p-5 md:p-6 bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl">
              <p className="text-white text-sm md:text-base font-medium leading-relaxed">
                Extending design services to outdoor spaces such as gardens, patios, and decks.
              </p>
            </div>
          </div>

          <div className="fadeInRight w-full">
            <div className="flex flex-col w-full border-t border-gray-200">
              {servicesList.map((service, index) => {
                const serviceId = service.id || `0${index + 1}`;
                const isActive = activeService === serviceId;

                return (
                  <div
                    key={index}
                    className={`group flex items-center justify-between py-4 sm:py-5 lg:py-6 px-1 sm:px-3 border-b border-gray-200 cursor-pointer transition-all duration-300 ${
                      isActive ? 'bg-blue-50/40' : 'hover:bg-gray-50/60'
                    }`}
                    onMouseEnter={() => setActiveService(serviceId)}
                    onClick={() => handleServiceClick(service, serviceId)}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-5 transform group-hover:translate-x-1.5 transition-transform duration-300 pr-2">
                      <span className="text-xs sm:text-base lg:text-2xl font-medium text-gray-400 min-w-[24px] sm:min-w-[36px]">
                        {serviceId}
                      </span>
                      <span className="text-xs sm:text-base md:text-lg lg:text-[23px] font-bold text-gray-800 leading-snug tracking-normal capitalize font-['Helvetica']">
                        {service.title}
                      </span>
                    </div>

                    <div className="flex items-center justify-end shrink-0 ml-2">
                      {isActive ? (
                        <div className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white shrink-0 shadow-sm">
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-gray-600 bg-gray-100 group-hover:bg-gray-200 border border-gray-200/80 transition-colors shrink-0">
                          <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 md:gap-4 mb-16 text-center items-start">
          {statsData.map((stat, index) => (
            <div key={index} className="flex flex-col items-center opal-move-up py-2">
              <h3 className="text-[36px] sm:text-[40px] md:text-[44px] font-bold text-[#3B82F6] font-helvetica leading-none mb-2">
                <AnimatedCounter text={stat.value} />
              </h3>

              <div className="w-full max-w-[120px] h-[1px] bg-gray-300 mb-2"></div>

              <h4 className="text-sm md:text-sm font-bold text-gray-900 mb-1 tracking-wider uppercase leading-tight">
                {stat.title}
              </h4>

              <p className="text-xs sm:text-xs text-gray-500 font-normal leading-relaxed max-w-[200px]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div ref={imageContainerRef} className="w-full flex justify-center opal-move-up mt-10">
          <img
            src={countingImg}
            alt="3D Floor Plan Rendering"
            className="w-full max-w-[1100px] object-cover scale-100"
            style={{
              transform: `translateX(${houseTranslateX}px) scale(1)`,
              transition: 'transform 0.1s ease-out'
            }}
            onError={(e) => {
              if (e.currentTarget.src !== defaultCountingImg) {
                e.currentTarget.src = defaultCountingImg;
              }
            }}
          />
        </div>

      </div>
    </section>
  );
};

export default OurServices;