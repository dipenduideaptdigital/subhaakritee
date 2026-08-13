import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import project1 from '../../assets/homepage/project1.png';
import project2 from '../../assets/homepage/project2.png';
import project3 from '../../assets/homepage/project3.png';
import project4 from '../../assets/homepage/project4.png';
import project5 from '../../assets/homepage/project5.png';
import defaultInterior from '../../assets/homepage/interior.png';
import apiClient from '../../api/client';
import { projectsApi } from '../../api/projects';
import { resolveAssetUrl } from '../../utils/assetResolver';

const defaultProjectsData = [
  { id: 1, slug: 'art-deco-revival', category: 'LANDSCAPE', title: 'Art Deco Revival', description: '<p>Improving homes with expert craftsmanship for years</p>', image: project1 },
  { id: 2, slug: 'modern-minimalist', category: 'RESIDENTIAL', title: 'Modern Minimalist', description: '<p>Improving homes with expert craftsmanship for years</p>', image: project2 },
  { id: 3, slug: 'urban-oasis', category: 'SINGLE HOME', title: 'Urban Oasis', description: '<p>Improving homes with expert craftsmanship for years</p>', image: project3 },
  { id: 4, slug: 'corporate-elegance', category: 'OFFICE AREA', title: 'Corporate Elegance', description: '<p>Improving homes with expert craftsmanship for years</p>', image: project4 },
  { id: 5, slug: 'retail-experience', category: 'COMMERCIAL', title: 'Retail Experience', description: '<p>Improving homes with expert craftsmanship for years</p>', image: project5 }
];

const smoothScrollTo = (element, target, duration) => {
  const start = element.scrollLeft;
  const change = target - start;
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress < 0.5 
      ? 4 * progress * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    element.scrollLeft = start + change * ease;

    if (elapsed < duration) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

const OurProjects = ({ data: externalData }) => {
  const carouselRef = useRef(null);
  const [content, setContent] = useState(externalData || null);
  const [projectsList, setProjectsList] = useState(defaultProjectsData);
  const [interiorImg, setInteriorImg] = useState(defaultInterior);

  // Mouse Drag States
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        let fetchedContent = externalData;
        if (!fetchedContent) {
          const res = await apiClient.get('/cms/section/homepage_our_projects');
          if (res.data?.success) {
            fetchedContent = res.data.data.content;
          }
        }

        if (isMounted && fetchedContent) {
          setContent(fetchedContent);
          const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';
          
          if (fetchedContent.bottomImage) {
            const botUrl = fetchedContent.bottomImage.startsWith('http') ? fetchedContent.bottomImage : `${serverUrl}${fetchedContent.bottomImage}`;
            const img = new Image();
            img.src = botUrl;
            img.onload = () => { if (isMounted) setInteriorImg(botUrl); };
            img.onerror = () => { if (isMounted) setInteriorImg(defaultInterior); };
          } else if (isMounted) {
            setInteriorImg(defaultInterior);
          }
        }

        const dynamicProjectsRes = await projectsApi.getPublicProjects({ limit: 6 });
        const dynamicProjects = dynamicProjectsRes.data || [];

        if (isMounted) {
          if (dynamicProjects.length > 0) {
            const mappedDynamic = dynamicProjects.map((p, idx) => ({
              id: p.id,
              slug: p.slug || p.id,
              category: p.category || 'PROJECT',
              title: p.title,
              description: p.description || '',
              image: resolveAssetUrl(p.featuredImage?.url || p.featuredImageId, defaultProjectsData[idx % defaultProjectsData.length].image)
            }));
            setProjectsList(mappedDynamic);
          } else if (fetchedContent?.projects?.length > 0) {
            const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';
            const mappedCMS = fetchedContent.projects.map((p, idx) => ({
              ...p,
              image: p.image ? (p.image.startsWith('http') ? p.image : `${serverUrl}${p.image}`) : defaultProjectsData[idx % defaultProjectsData.length].image
            }));
            setProjectsList(mappedCMS);
          } else {
            setProjectsList(defaultProjectsData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch projects data:', error);
        if (isMounted) setProjectsList(defaultProjectsData);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, [externalData]);

  const activeProjects = projectsList;
  
  const infiniteProjects = [
    ...activeProjects, ...activeProjects, ...activeProjects,
    ...activeProjects, ...activeProjects, ...activeProjects,
    ...activeProjects, ...activeProjects, ...activeProjects
  ];

  useEffect(() => {
    if (carouselRef.current && projectsList.length > 0) {
      setTimeout(() => {
        if (!carouselRef.current) return;
        const carousel = carouselRef.current;
        const innerContainer = carousel.firstElementChild;
        const firstCard = innerContainer ? innerContainer.firstElementChild : null;
        
        if (firstCard) {
          const cardWidth = firstCard.getBoundingClientRect().width;
          const gap = window.innerWidth >= 768 ? 40 : 24; 
          const threeCardsWidth = (cardWidth * 3) + (gap * 2);
          
          const sideSpace = (window.innerWidth - threeCardsWidth) / 2;
          
          const startItemOffset = 9 * (cardWidth + gap);
          
          carousel.scrollLeft = startItemOffset - sideSpace;
        } else {
          carousel.scrollLeft = carousel.scrollWidth / 3;
        }
      }, 100);
    }
  }, [projectsList]);

  useEffect(() => {
    if (isDragging) return;

    const autoScrollInterval = setInterval(() => {
      if (carouselRef.current) {
        const carousel = carouselRef.current;
        const innerContainer = carousel.firstElementChild;
        const firstCard = innerContainer ? innerContainer.firstElementChild : null;
        if (firstCard) {
          const cardWidth = firstCard.getBoundingClientRect().width;
          const gap = window.innerWidth >= 768 ? 40 : 24;
          smoothScrollTo(carousel, carousel.scrollLeft + cardWidth + gap, 1000);
        } else {
          smoothScrollTo(carousel, carousel.scrollLeft + 350, 1000);
        }
      }
    }, 3000);

    return () => clearInterval(autoScrollInterval);
  }, [isDragging]);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

    if (scrollLeft + clientWidth >= scrollWidth - 100) {
      carouselRef.current.scrollLeft = scrollLeft - (scrollWidth / 3);
    }

    if (scrollLeft <= 100) {
      carouselRef.current.scrollLeft = scrollLeft + (scrollWidth / 3);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftPos(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    
    carouselRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const badgeText = content?.badgeText || "OUR PROJECT";
  const title = content?.title || "Creative [Projects That \\n Define] Our Style";
  const description = content?.description || "<p>Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces functional and stylish commercial interiors</p>";

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
    <section className="pt-16 md:pt-24 bg-white overflow-hidden">

      {/* Top Header Section */}
      <div className="w-full relative mb-16 md:mb-24 px-6 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_3.5fr] gap-8 md:gap-12 items-start">
            <div className="fadeInLeft">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300">
                <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
                <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                  {badgeText}
                </span>
              </div>
            </div>

            <div className="fadeInRight">
              <h2 className="text-4xl md:text-5xl lg:text-[62px] font-bold tracking-tight text-gray-900 leading-[1.05] text-left">
                {renderTitle(title)}
              </h2>
              <div 
                className="text-gray-500 text-sm md:text-[19px] font-normal leading-relaxed max-w-[750px] text-left mt-6 prose-p:m-0"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-full overflow-hidden">
        <div
          className={`flex w-full overflow-x-auto hide-scrollbar opal-move-up select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          ref={carouselRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-6 md:gap-10 pb-12 items-start shrink-0 mt-4">
            {infiniteProjects.map((project, index) => {
              const originalIndex = index % 3;
              const isEven = index % 2 === 0;
              const marginTopClass = isEven ? 'mt-0' : 'mt-0 md:mt-24';

              return (
                <div
                  key={`${project.id}-${index}`}
                  className={`w-[250px] md:w-[320px] lg:w-[360px] shrink-0 flex flex-col ${marginTopClass}`}
                >
                  <Link 
                    to={`/projects/${project.slug || project.id}`}
                    onClick={(e) => {
                      if (hasDragged) e.preventDefault();
                    }}
                    className="flex flex-col group cursor-pointer"
                  >
                    {/* Image Card */}
                    <div className="relative w-full h-[380px] md:h-[500px] rounded-[2.5rem] overflow-hidden mb-6 shadow-sm bg-zinc-100 pointer-events-none">
                      <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        const defaultImg = defaultProjectsData[originalIndex].image;
                        if (e.currentTarget.src !== defaultImg) {
                          e.currentTarget.src = defaultImg;
                        }
                      }}
                    />
                    {/* Category Pill */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2">
                      <span className="px-5 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white text-[10px] tracking-widest uppercase shadow-sm whitespace-nowrap">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Text */}
                  <div className="px-2">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{project.title}</h3>
                    <div 
                      className="text-sm text-gray-500 font-normal leading-relaxed prose-p:m-0 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: project.description }}
                    />
                  </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: Typography & Image */}
      <div className="relative w-full mt-12 md:mt-24 pt-12 sm:pt-24 md:pt-36 pb-8 md:pb-16 flex flex-col items-center justify-end min-h-[220px] sm:min-h-[300px] md:min-h-[400px] opal-move-up">

        <div className="absolute -top-10 md:-top-20 left-0 right-0 overflow-hidden flex justify-center pointer-events-none z-0">
          <h2 className="text-[25vw] md:text-[22vw] font-black text-[#F3F4F6] leading-[1.25] select-none">
            Interior
          </h2>
        </div>

        <div className="container mx-auto px-8 md:px-14 relative z-12 mt-3 md:mt-7">
          <img
            src={interiorImg}
            alt="Interior Panoramic"
            className="w-full object-contain max-h-[400px]"
            onError={(e) => {
              if (e.currentTarget.src !== defaultInterior) {
                e.currentTarget.src = defaultInterior;
              }
            }}
          />
        </div>
      </div>

    </section>
  );
};

export default OurProjects;