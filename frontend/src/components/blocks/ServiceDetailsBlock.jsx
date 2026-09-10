import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Check } from 'lucide-react';
import disruptiveInnovation from '../../assets/service/disruptive-innovation.png';
import { resolveAssetUrl } from '../../utils/assetResolver';
import { pagesApi } from '../../api/pages';

const ServiceDetailsBlock = ({
  sidebarImage,
  mainImage,
  aboutTitle,
  aboutDescription,
  features = [],
  midImage1,
  midImage2,
  typesTitle,
  typesDescription,
  elementsTitle,
  elementsDescription,
  leftBullets = [],
  rightBullets = [],
  footerDescription,
  faqs = []
}) => {
  const [openFaq, setOpenFaq] = useState(0);
  const [dynamicServices, setDynamicServices] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchDynamicServices = async () => {
      try {
        const response = await pagesApi.getPublicPages();
        const allPages = response.data || [];
        const servicePages = allPages.filter(page =>
          page.fullPath && page.fullPath.startsWith('/services/')
        );

        setDynamicServices(servicePages);
      } catch (error) {
        console.error("Failed to fetch dynamic services for sidebar:", error);
      }
    };

    fetchDynamicServices();
  }, []);

  return (
    <section className="py-12 sm:py-16 lg:py-28 bg-[#F8F9FA] font-helvetica">
      <div className="container mx-auto max-w-[1400px] px-5 sm:px-6 md:px-8 lg:px-10">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-16">

          {/* Left Sidebar */}
          <div className="w-full lg:w-[32%] flex flex-col md:flex-row lg:flex-col gap-6 md:gap-6 lg:space-y-10 lg:gap-0 shrink-0">

            {/* Mobile-only Dropdown */}
            <div className="sm:hidden -mx-5 px-5 relative mb-4" ref={dropdownRef}>
              <h3 className="flex items-center gap-2 text-[15px] font-bold text-gray-900 mb-3">
                <span className="w-1.5 h-4 rounded-full bg-[#ffc300]"></span>
                Other Services
              </h3>

              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-5 py-3.5 shadow-sm text-left focus:outline-none transition-all duration-200 hover:border-[#ffc300]"
              >
                <span className="text-[15px] font-bold text-gray-900 capitalize">
                  {dynamicServices.find(s => location.pathname === s.fullPath)?.title || "Select Service"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-[#ffc300]' : ''}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-5 right-5 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="max-h-[300px] overflow-y-auto py-1">
                    {dynamicServices.length > 0 ? (
                      dynamicServices.map((service) => {
                        const isActive = location.pathname === service.fullPath;
                        return (
                          <Link
                            key={service.id}
                            to={service.fullPath}
                            onClick={() => setIsDropdownOpen(false)}
                            className={`block px-5 py-3.5 text-[14.5px] font-semibold transition-colors border-b border-gray-50 last:border-b-0 ${isActive
                              ? 'bg-[#ffc300]/10 text-[#ffc300]'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-[#ffc300]'
                              }`}
                          >
                            {service.title}
                          </Link>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-4 italic">No other services found.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/*  original card list */}
            <div className="hidden sm:block w-full md:w-1/2 lg:w-[95%] bg-white rounded-[24px] pt-10 pb-6 lg:pt-10 lg:pb-10 shadow-sm border border-gray-100/50">
              <h3 className="text-3xl lg:text-[32px] font-bold text-gray-900 mb-8 text-center px-4">
                Other Services
              </h3>
              <div className="flex flex-col px-8 lg:px-10">
                {dynamicServices.length > 0 ? (
                  dynamicServices.map((service, index) => {
                    const isActive = location.pathname === service.fullPath;
                    const isLast = index === dynamicServices.length - 1;

                    return (
                      <Link
                        to={service.fullPath}
                        key={service.id}
                        className={`group flex items-center justify-between py-[16px] lg:py-[20px] cursor-pointer transition-colors border-t ${isActive ? 'border-t-[2px] border-[#3B82F6]' : 'border-t border-gray-200'
                          } ${isLast ? 'border-b border-gray-200' : ''}`}
                      >
                        <div className="flex items-center space-x-4 md:space-x-5 transform group-hover:translate-x-2 transition-transform duration-300 pr-4 pl-4 lg:pl-6">
                          <span className={`text-[17px] lg:text-[19px] font-base leading-[1.2] capitalize font-helvetica transition-colors ${isActive ? 'text-[#ffc300]' : 'text-gray-900 group-hover:text-[#ffc300]'}`}>
                            {service.title}
                          </span>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-400 text-center italic">No other services found.</p>
                )}
              </div>
            </div>

            {/* Mobile-only */}
            <div className="sm:hidden relative w-full h-[190px] rounded-2xl overflow-hidden ">
              <img
                src={resolveAssetUrl(sidebarImage, '/default-sidebar.png')}
                alt="Sidebar Image"
                className="absolute inset-0 w-full h-full object-cover "
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
              <span className="absolute bottom-3 left-4 right-4 text-white text-[14px] font-semibold">
                Need Design Help?
              </span>
            </div>

            {/* original sidebar image */}
            <div className="hidden sm:block relative w-full md:w-1/2 lg:w-full h-[320px] md:h-auto lg:h-[450px] xl:h-[600px] rounded-[24px] overflow-hidden group mt-10">
              <img
                src={resolveAssetUrl(sidebarImage, '/default-sidebar.png')}
                alt="Sidebar Image"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-[68%] flex flex-col">
            {/* Main Image */}
<div className="hidden md:block w-[660px] h-[500px] rounded-[20px] overflow-hidden mb-8 lg:mb-10 ml-10">    
            <img
                src={resolveAssetUrl(mainImage, '/default-main.png')}
                alt="Service Main"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="pr-0 lg:pr-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 mb-5 tracking-tight leading-tight">
                {aboutTitle || 'About The Service'}
              </h1>

              <div
                className="text-gray-600 text-[15px] sm:text-[16px] leading-6 sm:leading-7 mb-8 sm:mb-10 prose prose-sm max-w-none prose-p:my-2 prose-strong:font-bold prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4"
                dangerouslySetInnerHTML={{ __html: aboutDescription || '' }}
              />

              <div className="grid grid-cols-2 gap-y-6 gap-x-4 sm:gap-y-8 sm:gap-x-10 mb-10 sm:mb-14">
                {features.map((item, index) => (
                  <div key={index} className="flex items-center gap-2.5 sm:gap-4">
                    <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-[#ffc300] flex items-center justify-center shrink-0">
                      <img src={disruptiveInnovation} alt={item.title} className="w-5.5 h-5.5 sm:w-8 sm:h-8 object-contain" />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h3 className="text-[15px] sm:text-[20px] font-bold text-[#222] leading-tight mb-0.5 sm:mb-0">{item.title}</h3>
                      <div 
                        className="text-[11.5px] sm:text-[13px] font-semibold leading-[16px] sm:leading-[20px] text-[#444] max-w-none sm:max-w-[230px] [&>p]:m-0"
                        dangerouslySetInnerHTML={{ __html: item.description || '' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="h-[280px] rounded-[24px] overflow-hidden">
                  <img src={resolveAssetUrl(midImage1, '/default-mid1.png')} alt="Detail 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="hidden md:block h-[280px] rounded-[24px] overflow-hidden">
                  <img src={resolveAssetUrl(midImage2, '/default-mid2.png')} alt="Detail 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 mb-5 tracking-tight leading-tight">
                {typesTitle || 'Types Of Commercial Spaces'}
              </h1>
              <div
                className="text-gray-600 text-[15px] sm:text-[16px] leading-6 sm:leading-7 mb-8 px-3 sm:mb-10 prose prose-sm max-w-none prose-p:my-2 prose-strong:font-bold prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4"
                dangerouslySetInnerHTML={{ __html: typesDescription || '' }}
              />

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 mb-5 tracking-tight leading-tight">
                {elementsTitle || 'Key Elements Of Interior Design'}
              </h1>
              <div
                className="text-gray-600 text-[15px] px-3 sm:text-[16px] leading-6 sm:leading-7 mb-8 sm:mb-10 prose prose-sm max-w-none prose-p:my-2 prose-strong:font-bold prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4"
                dangerouslySetInnerHTML={{ __html: elementsDescription || '' }}
              />

              {/* Mobile-only*/}
              <div className="sm:hidden bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 mb-6 overflow-hidden">
                {[...leftBullets, ...rightBullets].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 py-3.5">
                    <div className="w-6 h-6 rounded-full bg-[#ffc300]/10 flex items-center justify-center shrink-0">
                       <Check className="w-3.5 h-3.5 text-[#ffc300]" strokeWidth={3} />
                    </div>
                    <span className="text-gray-800 text-[14px] leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-8 px-3">
                <div className="flex flex-col space-y-5">
                  {leftBullets.map((item, idx) => (
                    <div key={`left-${idx}`} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffc300] shrink-0"></div>
                      <span className="text-gray-900 text-[16px]">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col space-y-5">
                  {rightBullets.map((item, idx) => (
                    <div key={`right-${idx}`} className="flex items-center gap-3  px-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffc300] shrink-0"></div>
                      <span className="text-gray-900 text-[16px]">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="text-gray-600 text-[15px] sm:text-[16px] px-3 leading-6 sm:leading-7 mt-6 sm:mt-8 mb-8 sm:mb-10 prose prose-sm max-w-none prose-p:my-2 prose-strong:font-bold prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4"
                dangerouslySetInnerHTML={{ __html: footerDescription || '' }}
              />

              <div className="mt-6 sm:mt-8 pt-6 sm:pt-10">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Frequently Asked Questions</h3>

                {/* Mobile-only*/}
                <div className="sm:hidden flex flex-col gap-3">
                  {faqs.map((faqItem, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? -1 : index)}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
                        >
                          <span className="text-[15px] font-bold text-gray-900 whitespace-pre-line">{faqItem.question}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-[#ffc300] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                            strokeWidth={2.5}
                          />
                        </button>
                        {faqItem.answer && (
                          <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                            <div className="overflow-hidden">
                              <p className="px-4 pb-4 text-[13.5px] leading-6 text-gray-600 whitespace-pre-line">{faqItem.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="hidden sm:flex sm:flex-col border-t border-gray-500">
                  {faqs.map((faqItem, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div key={index} className="border-b border-gray-500 bg-transparent flex flex-col py-3 md:py-5">
                        <button 
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? -1 : index)}
                          className="flex items-center justify-between w-full text-left cursor-pointer outline-none group"
                        >
                          <span className="text-[18px] md:text-[20px] font-bold text-gray-900 whitespace-pre-line group-hover:text-[#ffc300] transition-colors">{faqItem.question}</span>
                          <ChevronDown className={`w-5 h-5 text-[#ffc300] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                        </button>
                        <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'}`}>
                          <div className="overflow-hidden">
                            <p className="text-[15px] leading-7 text-gray-600 whitespace-pre-line pr-8 pb-2">{faqItem.answer}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetailsBlock;