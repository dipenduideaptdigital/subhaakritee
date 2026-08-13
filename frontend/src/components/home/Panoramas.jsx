import React, { useState, useEffect, useRef } from 'react';
import { FaCog } from 'react-icons/fa';
import defaultView from '../../assets/homepage/panoramas.png';
import apiClient from '../../api/client';

const Panoramas = ({ data: externalData }) => {
  const [content, setContent] = useState(externalData || null);
  const [panoramaImg, setPanoramaImg] = useState(defaultView);
  
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const processContent = (fetchedContent) => {
      if (isMounted) setContent(fetchedContent);
      const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';
      if (fetchedContent.image) {
        const imgUrl = fetchedContent.image.startsWith('http') ? fetchedContent.image : `${serverUrl}${fetchedContent.image}`;
        const img = new Image();
        img.src = imgUrl;
        img.onload = () => { if (isMounted) setPanoramaImg(imgUrl); };
        img.onerror = () => { if (isMounted) setPanoramaImg(defaultView); };
      } else if (isMounted) {
        setPanoramaImg(defaultView);
      }
    };

    if (externalData) {
      processContent(externalData);
      return () => { isMounted = false; };
    }

    const fetchPanoramasData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_panoramas');
        const { data } = res;
        if (data.success && data.data?.content) {
          processContent(data.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch panoramas content:', error);
      }
    };

    fetchPanoramasData();

    return () => {
      isMounted = false;
    };
  }, [externalData]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      
      const zoomSensitivity = 0.05;
      
      setScale((prevScale) => {
        let newScale = prevScale;
        if (e.deltaY < 0) {
          newScale = prevScale + zoomSensitivity;
        } else {
          newScale = prevScale - zoomSensitivity;
        }
        
        return Math.min(Math.max(newScale, 1), 3);
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const badgeText = content?.badgeText || "360-DEGREE PANORAMAS";
  const title = content?.title || "Create An Even [Greater \\n Experience]";

  const renderTitle = (titleText) => {
    if (!titleText) return null;
    const parts = titleText.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          // Adjusted color to match Figma's bright blue
          <span key={index} className="text-[#1388FF]">
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
    <section className="pt-6 md:pt-10 pb-16 md:pb-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-8 max-w-[1400px] flex flex-col items-center">
        
        {/* Centered Header Section */}
        <div className="flex flex-col items-center text-center mb-16 opal-move-up">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
            <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
              {badgeText}
            </span>
          </div>
          
          <h2 className="text-6xl md:text-[70px] font-bold tracking-tight text-black leading-[1.05] max-w-4xl">
            {renderTitle(title)}
          </h2>
        </div>

        <div 
          ref={containerRef}
          className="relative w-full max-w-7xl h-[300px] md:h-[500px] lg:h-[600px] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden opal-move-up group"
        >
          <img 
            src={panoramaImg}
            alt="360 Panoramic View"
            className="w-full h-full object-cover object-center"
            style={{ 
              transform: `scale(${scale})`, 
              transition: 'transform 0.1s ease-out',
              willChange: 'transform'
            }}
            onError={(e) => {
              if (e.currentTarget.src !== defaultView) {
                e.currentTarget.src = defaultView;
              }
            }}
          />
          
          <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 cursor-pointer hover:rotate-90 transition-transform duration-500 z-10">
            <FaCog className="w-10 h-10 md:w-12 md:h-12 text-white drop-shadow-md" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Panoramas;