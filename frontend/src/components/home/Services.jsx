import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';

const defaultServicesData = [
  {
    title: 'Architectural\nDesign',
    description: '<p>A business house born out of passion for fish keeping and nature conservation</p>'
  },
  {
    title: 'Interior Design\n& Planning',
    description: '<p>A business house born out of passion for fish keeping and nature conservation</p>'
  },
  {
    title: 'Consulting\nServices',
    description: '<p>A business house born out of passion for fish keeping and nature conservation</p>'
  },
  {
    title: 'Project\nManagement',
    description: '<p>A business house born out of passion for fish keeping and nature conservation</p>'
  }
];

const Services = ({ data: externalData }) => {
  const [content, setContent] = useState(externalData || null);

  useEffect(() => {
    if (externalData) {
      setContent(externalData);
      return;
    }
    const fetchServicesData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_services');
        const { data } = res;
        
        if (data.success && data.data?.content) {
          setContent(data.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch services content:', error);
      }
    };
    fetchServicesData();
  }, [externalData]);

  const badgeText = content?.badgeText || "WHO WE ARE";
  const title = content?.title || "Experience [The Art Of Interior] Design";
  const description = content?.description || "<p>If you use this site regularly and would like consider donating a small sum to help pay for the hosting and bandwidth bill. There is no minimum donation, any sum is appreciated</p>";
  const servicesList = content?.services || defaultServicesData;

  if (content?.isVisible === false) return null;
  
  return (
    <section id="services-section" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 md:gap-12 mb-12 md:mb-20 items-start">
          {/* Left: Badge */}
          <div className="fadeInLeft">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                {badgeText}
              </span>
            </div>
          </div>
          
          {/* Right: Heading & Description */}
          <div className="fadeInRight">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              {renderTitle(title)}
            </h2>
            <div 
              className="text-gray-500 max-w-2xl font-light text-sm md:text-base leading-relaxed prose prose-sm sm:prose-base max-w-none prose-p:my-2 prose-a:text-[#ffc300] hover:prose-a:text-[#e6b000]"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </div>

        {/* Bottom Section: Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {servicesList.map((service, index) => (
            <div 
              key={index} 
              className="group border border-gray-200/90 rounded-3xl p-6 sm:p-8 hover:shadow-xl hover:border-[#ffc300]/40 hover:-translate-y-1.5 transform transition-all duration-300 bg-white flex flex-col justify-start"
            >
              <div className="flex items-center justify-center min-h-[60px] sm:min-h-[72px] w-full mb-3">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 text-center whitespace-pre-line leading-snug group-hover:text-[#ffc300] transition-colors">
                  {service.title}
                </h3>
              </div>
              
              <div className="w-full h-[1px] bg-gray-200 my-4"></div>
              
              <div 
                className="text-gray-600 text-sm sm:text-base font-normal leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-a:text-[#ffc300] hover:prose-a:text-[#e6b000] [&_p]:text-center sm:[&_p]:text-left"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// Helper component or function to render title with primary colored text inside square brackets [like this]
const renderTitle = (titleText) => {
  if (!titleText) return null;
  const parts = titleText.split(/(\[[^\]]+\])/g);
  return parts.map((part, index) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return (
        <span key={index} className="text-[#ffc300]">
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
};

export default Services;