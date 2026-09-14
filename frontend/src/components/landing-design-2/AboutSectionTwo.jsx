import React from 'react';
import { ArrowRight } from 'lucide-react';
import { renderTitle } from '../../utils/titleRenderer';

import img1 from '../../assets/homepage/about3.png';
import img2 from '../../assets/homepage/about2.png';
import img3 from '../../assets/homepage/about1.png';

const getAssetUrl = (path, fallback) => {
  if (!path) return fallback;

  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }

  const baseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
    : 'http://localhost:5000';

  return `${baseUrl}${path}`;
};

const AboutSectionTwo = ({ data, onCtaClick }) => {
  const resolvedImg1 = data?.image1
    ? getAssetUrl(data.image1, img1)
    : img1;

  const resolvedImg2 = data?.image2
    ? getAssetUrl(data.image2, img2)
    : img2;

  const resolvedImg3 = data?.image3
    ? getAssetUrl(data.image3, img3)
    : img3;

  return (
    <section
      id="about"
      className="py-20 md:py-28 bg-[#f8f8f8] overflow-hidden font-helvetica"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-[1500px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          <div className="relative w-full max-w-[1100px] aspect-[862/767] mx-auto min-w-0">

            {/* Left Back Card */}
            <div
              className="absolute overflow-hidden shadow-lg z-10 rounded-2xl md:rounded-[24px]"
              style={{
                left: '-8%',
                top: '8%',
                width: '54%',
                height: '46%'
              }}
            >
              <img
                src={resolvedImg1}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Back Card */}
            <div
              className="absolute overflow-hidden shadow-lg z-20 rounded-2xl md:rounded-[24px]"
              style={{
                left: '54%',
                top: '0%',
                width: '51%',
                height: '78%'
              }}
            >
              <img
                src={resolvedImg2}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Center Front Card */}
            <div
              className="absolute overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.18)] z-30 rounded-2xl md:rounded-[24px]"
              style={{
                left: '23%',
                top: '35%',
                width: '58%',
                height: '78%'
              }}
            >
              <img
                src={resolvedImg3}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

          </div>

          <div className="flex flex-col items-start text-left w-full min-w-0">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>

              <span className="text-[11px] font-bold tracking-[0.2em] text-gray-600 uppercase">
                {data?.badgeText || 'STARTED IN 1989'}
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-8">
              {renderTitle(data?.title || 'Architecture\n[And Interiors, Our Dual]\nExpertise', 'text-[#ffc300]')}
            </h2>

            {/* Paragraph 1*/}
            <div 
              className="font-['Outfit',sans-serif] text-gray-600 text-base leading-relaxed mb-6 prose prose-sm max-w-none prose-p:my-2 prose-strong:font-bold prose-a:text-[#ffc300] hover:prose-a:text-[#e6b000]"
              dangerouslySetInnerHTML={{ 
                __html: data?.paragraph1 || '<p>We believe that every space has the power to inspire, and that great design brings that inspiration to life. Our mission is to craft environments that stir creativity, evoke emotion, and reflect the essence of those who inhabit them.</p>' 
              }}
            />

            {/* Paragraph 2  */}
            <div 
              className="font-['Outfit',sans-serif] text-gray-600 text-base leading-relaxed mb-10 prose prose-sm max-w-none prose-p:my-2 prose-strong:font-bold prose-a:text-[#ffc300] hover:prose-a:text-[#e6b000]"
              dangerouslySetInnerHTML={{ 
                __html: data?.paragraph2 || '<p>With a strong presence in Kolkata, Bhubaneswar, and Ranchi, our turnkey office interiors are thoughtfully crafted to enhance productivity, reflect your brand identity, and support the way your team works every day.</p>' 
              }}
            />

            {/* CTA */}
            <button
              onClick={onCtaClick}
              className="
                group
                inline-flex
                items-center
                gap-4
                pl-6
                pr-2
                py-2
                border
                border-gray-300
                rounded-full
                font-['Outfit',sans-serif]
                font-semibold
                text-gray-700
                hover:border-gray-500
                hover:bg-white
                transition-all
                duration-300
              "
            >
              <span className="font-['Outfit',sans-serif]">
                {data?.buttonText || "Let's Get Started"}
              </span>

              <div className="w-9 h-9 rounded-full bg-[#ffc300] flex items-center justify-center text-black shadow-sm transition-transform duration-300 group-hover:scale-110">
                <ArrowRight size={18} />
              </div>
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionTwo;