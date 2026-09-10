import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../../api/client';

import hww1 from '../../assets/homepage/hww1.png';
import hww2 from '../../assets/homepage/hww2.png';
import hww3 from '../../assets/homepage/hww3.png';
import hww4 from '../../assets/homepage/hww4.png';

const defaultStepsData = [
  {
    id: '01',
    title: 'Initial Consultation',
    description: '<p>We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.</p>',
    image: hww1
  },
  {
    id: '02',
    title: 'Design & Planning',
    description: '<p>We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.</p>',
    image: hww2
  },
  {
    id: '03',
    title: 'Implementation',
    description: '<p>We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.</p>',
    image: hww3
  },
  {
    id: '04',
    title: 'Project Handover',
    description: '<p>We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.</p>',
    image: hww4
  },
];

const marginClasses = [
  'mt-0',
  'lg:mt-16',
  'lg:mt-32',
  'lg:mt-48'
];

const useInViewTrigger = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -80px 0px',
        ...options,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
};

const HowWeWork = ({ data: externalData }) => {
  const [content, setContent] = useState(externalData || null);
  const [stepsList, setStepsList] = useState(defaultStepsData);
  const [cardsRef, cardsInView] = useInViewTrigger();

  useEffect(() => {
    let isMounted = true;

    const processContent = (fetchedContent) => {
      if (isMounted) setContent(fetchedContent);
      const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';

      if (fetchedContent.steps && fetchedContent.steps.length > 0) {
        const mapped = fetchedContent.steps.map((step, idx) => {
          const defaultImg = defaultStepsData[idx % defaultStepsData.length].image;
          return {
            ...step,
            image: step.image ? (step.image.startsWith('http') ? step.image : `${serverUrl}${step.image}`) : defaultImg
          };
        });
        if (isMounted) setStepsList(mapped);
      } else if (isMounted) {
        setStepsList(defaultStepsData);
      }
    };

    if (externalData) {
      processContent(externalData);
      return () => { isMounted = false; };
    }

    const fetchStepsData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_how_we_work');
        const { data } = res;
        if (data.success && data.data?.content) {
          processContent(data.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch how we work content:', error);
      }
    };

    fetchStepsData();
    return () => {
      isMounted = false;
    };
  }, [externalData]);

  const badgeText = content?.badgeText || "HOW WE WORK";
  const title = content?.title || "Description [Architecture \\n Process] For Exceptional \\n Results.";
  const description = content?.description || "<p>Our process is alive – adapting, refining, and growing with your vision. Always. Like artists with a blank canvas, we transform rooms into living works of art.</p>";
  const bottomText = content?.bottomText || "We've Been Working Hard To Impress You.";
  const bottomLinkText = content?.bottomLinkText || "Start Your's Today";
  const bottomLinkUrl = content?.bottomLinkUrl || "#";

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
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl">
        
        {/* Top Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 mb-20 items-start">
          {/* Left: Badge & Heading */}
          <div className="fadeInLeft">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300 mb-8 bg-white">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                {badgeText}
              </span>
            </div>
            
            <h2 className="text-5xl md:text-[56px] font-bold tracking-tight text-gray-900 leading-[1.1]">
              {renderTitle(title)}
            </h2>
          </div>
          
          {/* Right: Description Text */}
          <div className="pb-2 fadeInRight mt-6 lg:mt-[110px]">
            <div 
              className="text-gray-500 text-sm font-normal leading-relaxed max-w-md [&>p]:mb-2 last:[&>p]:mb-0"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </div>

        {/* Staggered Cards Section */}
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 mb-24 items-start"
        >
          {stepsList.map((step, index) => {
            const stepId = step.id || `0${index + 1}`;
            const marginTopClass = marginClasses[index % marginClasses.length];

            return (
              <div 
                key={index} 
                className={`bg-[#E3E9F5] rounded-3xl p-6 sm:p-6 lg:p-5 relative overflow-hidden flex flex-col ${marginTopClass || ''} transition-all duration-700 ease-out ${
                  cardsInView 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: cardsInView ? `${index * 120}ms` : '0ms' }}
              >
                {/* Rectangular Image */}
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 sm:mb-6 shrink-0 bg-white shadow-sm">
                  <img 
                    src={step.image} 
                    alt={step.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const fallbackImg = defaultStepsData[index % defaultStepsData.length].image;
                      if (e.currentTarget.src !== fallbackImg) {
                        e.currentTarget.src = fallbackImg;
                      }
                    }}
                  />
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex-grow px-1">
                  <h3 className="text-xl sm:text-xl lg:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
                    {stepId}. {step.title}
                  </h3>
                  
                  <div 
                    className="text-sm sm:text-sm text-gray-600 font-normal leading-relaxed max-w-[92%] pb-12 sm:pb-14 lg:pb-16 [&>p]:mb-1 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4"
                    dangerouslySetInnerHTML={{ __html: step.description }}
                  />
                </div>

                <div className="absolute -bottom-1 right-2 sm:right-3 md:right-4 text-[75px] sm:text-[90px] md:text-[100px] lg:text-[110px] leading-[0.8] mb-3 font-black text-white/70 z-0 select-none pointer-events-none">
                  {stepId}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Text */}
        <div className="text-center">
          <p className="text-gray-900 font-medium">
            {bottomText} <a href={bottomLinkUrl} className="text-[#ffc300] hover:underline font-bold">{bottomLinkText}</a>
          </p>
        </div>

      </div>
    </section>
  );
};

export default HowWeWork;