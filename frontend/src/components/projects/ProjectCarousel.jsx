import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { projectsApi } from '../../api/projects';
import { resolveAssetUrl } from '../../utils/assetResolver'; 

const ProjectCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await projectsApi.getPublicProjects({ limit: 6 }); 
        if (res.data && res.data.length > 0) {
          
          const fetchedImages = res.data.map(p => 
            resolveAssetUrl(p.featuredImage?.url || p.featuredImageId, '/default-project.png')
          );

          let validSlides = [...fetchedImages];
          while (validSlides.length > 0 && validSlides.length < 3) {
            validSlides = [...validSlides, ...fetchedImages];
          }

          setSlides(validSlides);
          setCurrentIndex(1 % validSlides.length); 
        }
      } catch (error) {
        console.error("Failed to load carousel images", error);
      }
    };
    
    fetchImages();
  }, []);

  const totalSlides = slides.length;

  const handleNext = () => {
    if (totalSlides === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const handlePrev = () => {
    if (totalSlides === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  // Auto-play feature
  useEffect(() => {
    if (isHovered || totalSlides === 0) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [isHovered, totalSlides]);

  if (totalSlides === 0) return null;

  return (
    <div 
      className="relative w-full overflow-hidden bg-white py-12 md:py-5 "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Container */}
      <div className="relative h-[250px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full flex items-center justify-center px-4">
        {slides.map((slide, index) => {
          let positionClass = "opacity-1 pointer-events-none scale-75 z-0";
          let action = null;

          const isCenter = index === currentIndex;
          const isLeft = index === (currentIndex - 1 + totalSlides) % totalSlides;
          const isRight = index === (currentIndex + 1) % totalSlides;

          if (isCenter) {
            positionClass = "opacity-100 scale-100 z-20 cursor-default translate-x-0";
          } else if (isLeft) {
            positionClass = "opacity-35 sm:opacity-45 blur-[0.5px] scale-90 -translate-x-[85vw] sm:-translate-x-[48vw] lg:-translate-x-[45vw] z-10 cursor-pointer hover:opacity-60";
            action = handlePrev;
          } else if (isRight) {
            positionClass = "opacity-35 sm:opacity-45 blur-[0.5px] scale-90 translate-x-[85vw] sm:translate-x-[48vw] lg:translate-x-[45vw] z-10 cursor-pointer hover:opacity-60";
            action = handleNext;
          }

          return (
            <div
              key={index}
              onClick={action}
              className={`absolute top-0 w-[80vw] sm:w-[48vw] lg:w-[45vw] h-full rounded-[20px] sm:rounded-[1rem] overflow-hidden transition-all duration-[750ms] ease-out ${positionClass}`}
            >
              {/* Fade overlay for side preview slides */}
              {!isCenter && (
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[0.5px] z-10 transition-opacity duration-300"></div>
              )}
              <img
                src={slide}
                alt={`Project Showcase Slide ${index + 1}`}
                className="w-full h-full object-cover select-none"
                draggable={false}
              />
            </div>
          );
        })}

        {/* Hover Navigation Arrows */}
        <button
          onClick={handlePrev}
          className={`absolute left-4 sm:left-8 w-12 h-12 rounded-full bg-white/80 hover:bg-white text-zinc-900 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer z-30 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className={`absolute right-4 sm:right-8 w-12 h-12 rounded-full bg-white/80 hover:bg-white text-zinc-900 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer z-30 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex justify-center items-center gap-3 mt-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentIndex 
                ? 'w-8 bg-[#ffc300]' 
                : 'w-2.5 bg-zinc-300 hover:bg-zinc-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectCarousel;