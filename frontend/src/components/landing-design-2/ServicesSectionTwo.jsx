import React from 'react';
import { renderTitle } from '../../utils/titleRenderer';
import img1 from '../../assets/homepage/view.jpg';
import img2 from '../../assets/homepage/about_img.png';
import img3 from '../../assets/homepage/gallery4.png';

const getAssetUrl = (path, fallback) => {
  if (!path) return fallback;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const ServicesSectionTwo = ({ data }) => {
  const fallbackImages = [img1, img2, img3];

  // Use data.services if provided and not empty, otherwise default to three placeholder services
  const rawServices = data?.services && data.services.length > 0 
    ? data.services 
    : [
        { 
          title: 'Initial Consultation', 
          description: '<p>We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.</p>',
          image: img1
        },
        { 
          title: 'Design & Planning', 
          description: '<p>We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.</p>',
          image: img2
        },
        { 
          title: 'Implementation', 
          description: '<p>We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.</p>',
          image: img3
        }
      ];

  const servicesList = rawServices.map((service, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    const fallback = fallbackImages[idx % fallbackImages.length];
    const resolvedImg = service?.image ? getAssetUrl(service.image, fallback) : fallback;
    const imageAtTop = idx % 2 === 0;

    return {
      num,
      title: service?.title || 'Initial Consultation',
      desc: service?.description || '<p>We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.</p>',
      image: resolvedImg,
      imageAtTop,
    };
  });

  return (
    <section id="services" className="py-10 md:py-23 bg-[#111111] text-white font-helvetica overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl">
        
        {/* Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-12 mb-16 md:mb-20 text-left">
          {/* Tagline Badge */}
          <div className="shrink-0">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#ffc300]"></span>
              <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/90">
                {data?.badgeText || 'OUR SERVICES'}
              </span>
            </div>
          </div>

          {/* Main Title */}
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-5xl lg:text-[48px] font-bold leading-[1.15] tracking-tight font-helvetica text-white">
              {renderTitle(data?.title || 'Explore Our [Comprehensive]\n[Interior Design] Services', 'text-[#ffc300]')}
            </h2>
          </div>
        </div>

        {/* Alternating Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {servicesList.map((service, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl md:rounded-[32px] p-4 sm:p-6 md:p-8 flex flex-col min-h-[300px] sm:min-h-[360px] md:min-h-[450px] h-full shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden text-gray-900"
            >
              {service.imageAtTop ? (
                <>
                  {/* Top Image */}
                  <div className="w-full h-[100px] sm:h-[140px] md:h-[190px] rounded-xl md:rounded-[24px] overflow-hidden mb-4 md:mb-6 shrink-0">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImages[idx % fallbackImages.length];
                      }}
                    />
                  </div>

                  {/* Bottom Content Area */}
                  <div className="flex flex-col text-left">
                    <div className="flex justify-between items-start mb-2 md:mb-3">
                      <h3 className="text-xs sm:text-lg md:text-2xl font-bold text-gray-900 leading-[1.2]">
                        {service.title}
                      </h3>
                      <span className="text-2xl sm:text-3xl md:text-[44px] font-extrabold text-[#ffc300] leading-none shrink-0 ml-2 md:ml-4">
                        {service.num}
                      </span>
                    </div>
                    {/*Rich Text Rendering */}
                    <div 
                      className="text-gray-500 text-[10px] sm:text-xs md:text-[14px] leading-relaxed font-normal prose prose-sm max-w-none prose-p:m-0 prose-strong:font-bold prose-a:text-[#ffc300] hover:prose-a:text-[#e6b000]"
                      dangerouslySetInnerHTML={{ __html: service.desc }}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Top Content Area */}
                  <div className="flex flex-col text-left mb-4 md:mb-6">
                    <div className="flex justify-between items-start mb-2 md:mb-3">
                      <h3 className="text-xs sm:text-lg md:text-2xl font-bold text-gray-900 leading-[1.2]">
                        {service.title}
                      </h3>
                      <span className="text-2xl sm:text-3xl md:text-[44px] font-extrabold text-[#ffc300] leading-none shrink-0 ml-2 md:ml-4">
                        {service.num}
                      </span>
                    </div>
                    <div 
                      className="text-gray-500 text-[10px] sm:text-xs md:text-[14px] leading-relaxed font-normal prose prose-sm max-w-none prose-p:m-0 prose-strong:font-bold prose-a:text-[#ffc300] hover:prose-a:text-[#e6b000]"
                      dangerouslySetInnerHTML={{ __html: service.desc }}
                    />
                  </div>

                  {/* Bottom Image */}
                  <div className="w-full h-[100px] sm:h-[140px] md:h-[190px] rounded-xl md:rounded-[24px] overflow-hidden shrink-0 mt-auto">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImages[idx % fallbackImages.length];
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicesSectionTwo;