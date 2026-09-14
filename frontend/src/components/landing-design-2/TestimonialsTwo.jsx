import React from 'react';
import { renderTitle } from '../../utils/titleRenderer';
import defaultMainImg from '../../assets/homepage/review.jpg';

const defaultAuthorImg = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop";

const getAssetUrl = (path, fallback) => {
  if (!path) return fallback;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const TestimonialsTwo = ({ data }) => {
  const resolvedMainImg = data?.image ? getAssetUrl(data.image, defaultMainImg) : defaultMainImg;
  const resolvedAuthorImg = data?.authorImage ? getAssetUrl(data.authorImage, defaultAuthorImg) : defaultAuthorImg;

  const badgeText = data?.badgeText || "OUR CLIENTS SAY";
  const subtitle = data?.description || "<p>Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces functional and stylish commercial interiors</p>";
  
  const quote = data?.mainQuote || "I absolutely love my the new modern living room! The clean lines, a neutral tones, and minimalist interior create such a calming & stylish atmosphere. Highly recommend their modern interior design services!";
  const authorName = data?.authorName || "Morgan Dufresne";
  const authorRole = data?.authorRole || "Company owner";

  return (
    <section className="py-20 md:py-24 bg-[#f8f9fa] text-gray-900 font-helvetica overflow-hidden select-none">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl">
        
        {/* Top Split Header */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-6 lg:gap-12 mb-16 items-start text-left">
          {/* Left Column: Badge */}
          <div className="shrink-0">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300 bg-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffc300]"></span>
              <span className="text-[10px] md:text-[11px] font-bold tracking-widest text-gray-700 uppercase">
                {badgeText}
              </span>
            </div>
          </div>

          {/* Right Column: Title and Subtitle */}
          <div className="flex flex-col items-start max-w-4xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-gray-950 tracking-tight leading-[1.1] mb-6 font-helvetica">
              {renderTitle(data?.title || 'Here’s What [Warm Words]\n[Our Clients] Say', 'text-[#ffc300]')}
            </h2>
            <div 
              className="text-gray-500 text-sm md:text-base leading-relaxed font-normal max-w-3xl prose prose-sm max-w-none prose-p:my-1 prose-a:text-[#ffc300] hover:prose-a:text-[#e6b000]"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          </div>
        </div>

        {/* Bottom Testimonial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Large Showcase Image */}
          <div className="w-full aspect-[16/10] md:aspect-[16/9.5] rounded-[28px] md:rounded-[32px] overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.06)] border border-gray-200/50 bg-white">
            <img 
              src={resolvedMainImg} 
              alt="Testimonial Showcase" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = defaultMainImg;
              }}
            />
          </div>

          {/* Right Column: Divider Line, Quote and Author Details */}
          <div className="flex flex-col items-start text-left lg:pl-4 justify-between min-h-[300px] md:min-h-[380px]">
            {/* Horizontal Divider Line */}
            <div className="w-full h-[1px] bg-gray-200 mb-6"></div>

            {/* Testimonial Quote */}
            <div className="my-auto py-2 flex-1 min-h-[120px] max-h-[300px] overflow-y-auto hide-scrollbar">
              <blockquote className="text-[#4B4B4B] text-lg md:text-[22px] lg:text-[24px] font-normal leading-relaxed md:leading-[34px] tracking-[0em] max-w-2xl font-helvetica">
                &ldquo;{quote}&rdquo;
              </blockquote>
            </div>

            {/* Author Profile block */}
            <div className="flex items-center space-x-4 pt-4">
              <img 
                src={resolvedAuthorImg} 
                alt={authorName} 
                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover shadow-[0_4px_10px_rgba(0,0,0,0.05)] border border-white shrink-0"
                onError={(e) => {
                  e.currentTarget.src = defaultAuthorImg;
                }}
              />
              <div className="flex flex-col justify-center leading-tight">
                <span className="text-base font-bold text-gray-900 font-helvetica">{authorName}</span>
                <span className="text-[12px] md:text-[13px] text-gray-500 font-normal font-helvetica mt-1">{authorRole}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TestimonialsTwo;