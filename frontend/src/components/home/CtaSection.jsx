import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';

const CtaSection = ({ data: externalData }) => {
  const [content, setContent] = useState(externalData || null);

  useEffect(() => {
    let isMounted = true;

    if (externalData) {
      setContent(externalData);
      return () => { isMounted = false; };
    }

    const fetchCtaData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_cta');
        const { data } = res;
        if (data.success && data.data?.content && isMounted) {
          setContent(data.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch cta content:', error);
      }
    };

    fetchCtaData();

    return () => {
      isMounted = false;
    };
  }, [externalData]);

  const badgeText = content?.badgeText || "GET IN TOUCH";
  const title = content?.title || "Have A Project In [Mind? Let's]\n[Make] It Happen";
  const buttonText = content?.buttonText || "BOOK A FREE CONSULTATION";

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
    <section className="py-14 sm:py-16 md:py-20 lg:py-24 bg-white border-t border-zinc-200 font-['Helvetica',sans-serif]">
      <div className="container mx-auto px-5 sm:px-6 md:px-8 max-w-7xl font-['Helvetica',sans-serif]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start font-['Helvetica',sans-serif]">
          
          {/* Left Column: Badge */}
          <div className="md:col-span-3 md:pr-4 fadeInLeft">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300 mt-2">
              <span className="w-2 h-2 rounded-full bg-[#f97316] shrink-0"></span>
              <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase font-['Helvetica',sans-serif]">
                {badgeText}
              </span>
            </div>
          </div>
          
          {/* Right Column: Headline & Button */}
          <div className="md:col-span-9 flex flex-col items-start fadeInRight font-['Helvetica',sans-serif]">
            <h2 className="font-['Helvetica',sans-serif] text-[32px] sm:text-[40px] md:text-[52px] lg:text-[68px] font-bold text-zinc-900 leading-[1.15] lg:leading-[1.1] tracking-tight mb-8 sm:mb-10 lg:mb-12">
              {renderTitle(title)}
            </h2>
            
            {/* CTA Button*/}
            <Link to="/contact" className="max-w-full">
              <button className="group inline-flex items-center gap-3 sm:gap-4 rounded-full border border-zinc-300 hover:border-[#3B82F6] transition-colors pl-4 pr-2 sm:pl-6 py-2 opal-move-up cursor-pointer max-w-full font-['Helvetica',sans-serif]">
                <span className="text-[11px] sm:text-[13px] font-bold tracking-wider text-zinc-600 uppercase group-hover:text-zinc-900 transition-colors truncate font-['Helvetica',sans-serif]">
                  {buttonText}
                </span>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-md shrink-0">
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                </div>
              </button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CtaSection;