import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import about_img from "../../assets/homepage/about_img.png";
import tick from "../../assets/logos/tick.png";
import apiClient from '../../api/client';

const AboutSection = ({ data: externalData }) => {
  const [content, setContent] = useState(externalData || null);
  const [aboutImage, setAboutImage] = useState(about_img);
  const [isArrowClicked, setIsArrowClicked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const processContent = (fetchedContent) => {
      if (isMounted) setContent(fetchedContent);
      const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';
      const imageUrl = fetchedContent.image ? (fetchedContent.image.startsWith('http') ? fetchedContent.image : `${serverUrl}${fetchedContent.image}`) : null;

      if (imageUrl) {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => { if (isMounted) setAboutImage(imageUrl); };
        img.onerror = () => { if (isMounted) setAboutImage(about_img); };
      } else if (isMounted) {
        setAboutImage(about_img);
      }
    };

    if (externalData) {
      processContent(externalData);
      return () => { isMounted = false; };
    }

    const fetchAboutData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_about');
        const { data } = res;

        if (data.success && data.data?.content) {
          processContent(data.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch about content:', error);
      }
    };

    fetchAboutData();

    return () => {
      isMounted = false; // Cleanup function to prevent memory leaks
    };
  }, [externalData]);

  // Safe defaults if content is missing or loading
  const badgeText = content?.badgeText || "STARTED IN 1991";
  const title = content?.title || "Where Spaces Inspire, And [Design Comes Alive]";
  const description = content?.description || "<p>Whether it's your home, office, or a commercial project, we are always dedicated to bringing your vision to life. Our numbers speak better than words:</p>";
  const buttonText = content?.buttonText || "More About Us";
  const highlights = content?.highlights || [
    "Latest Technologies",
    "High-Quality Designs",
    "10 Years Warranty",
    "Residential Design"
  ];

  // Helper component or function to render title with primary colored text inside square brackets [like this]
  const renderTitle = (titleText) => {
    if (!titleText) return null;
    const parts = titleText.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-primary">
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });
  };

  if (content?.isVisible === false) return null;
  
  return (
    <section className="py-24 bg-[#121212] overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left Column: Content */}
          <div className="text-white max-w-xl fadeInLeft">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-600 mb-8">
              <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
              <span className="text-[10px] uppercase tracking-widest font-medium text-gray-300">
                {badgeText}
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-5xl md:text-6xl font-bold leading-[1.1] mb-10 tracking-tight">
              {renderTitle(title)}
            </h2>

            {/* Checkmarks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-10">
              {highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <img src={tick} alt="tick" className="w-5 h-5 object-contain" />
                  <span className="font-semibold text-sm">{highlight}</span>
                </div>
              ))}
            </div>

            <div
              className="text-[#FFFFFF] mb-10 max-w-md [&_p]:mb-2 last:[&_p]:mb-0 [&_a]:text-blue-400 hover:[&_a]:text-blue-300 [&_strong]:text-white [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '20px', lineHeight: '25px', fontWeight: 400 }}
              dangerouslySetInnerHTML={{ __html: description }}
            />

            {/* CTA Button */}
            <button
              onClick={() => {
                setIsArrowClicked(true);
                setTimeout(() => navigate('/about'), 300);
              }}
              className="group inline-flex items-center space-x-6 rounded-full border border-gray-500 hover:border-white transition-all pl-6 pr-2 py-2"
            >
              <span className="text-sm font-medium tracking-wide">{buttonText}</span>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-lg">
                {isArrowClicked ? <ArrowRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
              </div>
            </button>
          </div>

          {/* Right Column: Image */}
          <div
            className="relative overflow-hidden shadow-2xl fadeInRight lg:ml-auto"
            style={{
              width: '100%',
              maxWidth: '540px',
              aspectRatio: '540 / 650',
              borderRadius: '41px',
              opacity: 1,
              transform: 'rotate(0deg)'
            }}
          >
            <img
              src={aboutImage}
              alt="Modern Residential Exterior"
              className="w-full h-full object-cover transition-opacity duration-500"
              onError={(e) => {
                if (e.currentTarget.src !== about_img) {
                  e.currentTarget.src = about_img;
                }
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;