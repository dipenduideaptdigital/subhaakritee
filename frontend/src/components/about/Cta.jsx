import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';

const Cta = ({ data: externalData }) => {
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

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-gray-100 font-['Helvetica',sans-serif]">
      <div className="container mx-auto max-w-[1300px] px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start font-['Helvetica',sans-serif]">
          
          <div className="lg:col-span-3 flex items-start">
            <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 w-max">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-600 font-['Helvetica',sans-serif]">
                {badgeText}
              </span>
            </div>
          </div>
          
          <div className="lg:col-span-9 flex flex-col items-start font-['Helvetica',sans-serif]">
            
            <h2 className="text-[36px] md:text-[54px] lg:text-[64px] font-bold text-[#111827] leading-[1.1] tracking-[-0.03em] mb-12 font-['Helvetica',sans-serif]">
              {renderTitle(title)}
            </h2>
            
            <Link to="/contact">
                <button className="group flex items-center border border-gray-300 rounded-full pl-7 pr-2 py-2 w-max hover:border-[#ffc300] transition-colors duration-300 cursor-pointer font-['Helvetica',sans-serif]">
                <span className="font-semibold text-[15px] text-[#111827] group-hover:text-[#228BFF] transition-colors tracking-wide mr-6 font-['Helvetica',sans-serif]">
                  {buttonText}
                </span>
                <div className="w-11 h-11 rounded-full bg-[#228BFF] flex items-center justify-center text-white transition-all duration-300 group-hover:bg-[#1b6ecc]">
                  <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2.5} />
                </div>
              </button>
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Cta;