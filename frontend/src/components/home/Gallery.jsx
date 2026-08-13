import React, { useRef, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Grid } from 'lucide-react';
import gallery1 from '../../assets/homepage/gallery1.png';
import gallery2 from '../../assets/homepage/gallery2.png';
import gallery3 from '../../assets/homepage/gallery3.png';
import gallery4 from '../../assets/homepage/gallery4.png';
import gallery5 from '../../assets/homepage/gallery5.png';
import gallery6 from '../../assets/homepage/gallery6.png';
import apiClient from '../../api/client';
import { resolveAssetUrl } from '../../utils/assetResolver';

const defaultImages = [
  gallery1, gallery2, gallery3, gallery4, gallery5, gallery6
];

const Gallery = () => {
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const half1Ref = useRef(null);
  const half2Ref = useRef(null);
  
  const [content, setContent] = useState(null);
  const [imagesList, setImagesList] = useState(defaultImages);

  useEffect(() => {
    let isMounted = true;
    const fetchGalleryData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_gallery');
        const { data } = res;
        if (data.success && data.data?.content) {
          const fetchedContent = data.data.content;
          if (isMounted) setContent(fetchedContent);
          
          if (fetchedContent.images && fetchedContent.images.length > 0) {
            const mapped = fetchedContent.images.map((img, idx) => {
              return resolveAssetUrl(img, defaultImages[idx % defaultImages.length]);
            });
            if (isMounted) setImagesList(mapped);
          } else if (isMounted) {
            setImagesList(defaultImages);
          }
        }
      } catch (error) {
        console.error('Failed to fetch gallery content:', error);
      }
    };
    fetchGalleryData();
    return () => { isMounted = false; };
  }, []);

  const bgText = content?.bgText || "gallery";

  // Lightbox States
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGridView, setShowGridView] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [lightboxOpen]);

  const closeLightbox = () => {
    setLightboxOpen(false);
    setShowGridView(false);
    setIsZoomed(false);
  };
  
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
  };
  
  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  const topRowImages = [
    { id: 't1', img: imagesList[0] || gallery1, aspect: 'aspect-[4/3]', margin: 'mt-0', originalIndex: 0 },
    { id: 't2', img: imagesList[2] || gallery3, aspect: 'aspect-[16/9]', margin: 'mt-0 md:mt-16', originalIndex: 2 },
    { id: 't3', img: imagesList[4] || gallery5, aspect: 'aspect-[4/3]', margin: 'mt-0', originalIndex: 4 }
  ];

  const bottomRowImages = [
    { id: 'b1', img: imagesList[1] || gallery2, aspect: 'aspect-[16/9]', margin: 'mt-0', originalIndex: 1 },
    { id: 'b2', img: imagesList[3] || gallery4, aspect: 'aspect-[4/3]', margin: 'mt-0 md:mt-16', originalIndex: 3 },
    { id: 'b3', img: imagesList[5] || gallery6, aspect: 'aspect-[16/9]', margin: 'mt-0', originalIndex: 5 }
  ];

  const duplicatedTop = [...topRowImages, ...topRowImages, ...topRowImages, ...topRowImages];
  const duplicatedBottom = [...bottomRowImages, ...bottomRowImages, ...bottomRowImages, ...bottomRowImages];

  useEffect(() => {
    if (row2Ref.current && half2Ref.current) {
      row2Ref.current.scrollLeft = half2Ref.current.clientWidth;
    }

    let lastScrollY = window.scrollY;

    const handleVerticalScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      const speedFactor = 0.2; 
      const horizontalMove = scrollDelta * speedFactor;

      if (row1Ref.current && half1Ref.current) {
        row1Ref.current.scrollLeft += horizontalMove;
        
        // Loop bound checking
        if (row1Ref.current.scrollLeft >= half1Ref.current.clientWidth) {
          row1Ref.current.scrollLeft -= half1Ref.current.clientWidth;
        } else if (row1Ref.current.scrollLeft <= 0) {
          row1Ref.current.scrollLeft += half1Ref.current.clientWidth;
        }
      }

      // 2nd Row (Bottom) 
      if (row2Ref.current && half2Ref.current) {
        row2Ref.current.scrollLeft -= horizontalMove;
        
        // Loop bound checking
        if (row2Ref.current.scrollLeft >= half2Ref.current.clientWidth) {
          row2Ref.current.scrollLeft -= half2Ref.current.clientWidth;
        } else if (row2Ref.current.scrollLeft <= 0) {
          row2Ref.current.scrollLeft += half2Ref.current.clientWidth;
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleVerticalScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleVerticalScroll);
  }, []);

  if (content?.isVisible === false) return null;
  
  return (
    <section className="py-10 sm:py-16 md:py-32 bg-white relative overflow-hidden min-h-0 md:min-h-[700px]">
      <div className="absolute -top-8 sm:-top-16 md:-top-16 left-0 w-full flex justify-center pointer-events-none z-0">
        <h2 className="text-[22vw] sm:text-[24vw] md:text-[26vw] font-black text-[#F3F4F6] tracking-[-0.05em] leading-[0.85] select-none lowercase">
          {bgText}
        </h2>
      </div>

      <div className="relative z-10 w-full mt-6 sm:mt-10 md:mt-20 opal-move-up flex flex-col gap-3 sm:gap-4 md:gap-6">
        
        {/* Top Row */}
        <div ref={row1Ref} className="flex overflow-hidden items-start w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div ref={half1Ref} className="flex gap-3 sm:gap-4 md:gap-6 pr-3 sm:pr-4 md:pr-6 items-start shrink-0">
            {duplicatedTop.map((item, index) => (
              <div key={`t1-${index}`} className={`w-[200px] sm:w-[280px] md:w-[380px] shrink-0 ${item.margin}`}>
                <div 
                  className={`w-full rounded-[1rem] sm:rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden shadow-sm ${item.aspect} bg-zinc-100 cursor-pointer relative group`}
                  onClick={() => { setCurrentImageIndex(item.originalIndex); setLightboxOpen(true); }}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10"></div>
                  <img src={item.img} alt="Gallery Top" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-3 sm:gap-4 md:gap-6 pr-3 sm:pr-4 md:pr-6 items-start shrink-0">
            {duplicatedTop.map((item, index) => (
              <div key={`t2-${index}`} className={`w-[200px] sm:w-[280px] md:w-[380px] shrink-0 ${item.margin}`}>
                <div 
                  className={`w-full rounded-[1rem] sm:rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden shadow-sm ${item.aspect} bg-zinc-100 cursor-pointer relative group`}
                  onClick={() => { setCurrentImageIndex(item.originalIndex); setLightboxOpen(true); }}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10"></div>
                  <img src={item.img} alt="Gallery Top" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div ref={row2Ref} className="flex overflow-hidden items-start w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div ref={half2Ref} className="flex gap-3 sm:gap-4 md:gap-6 pr-3 sm:pr-4 md:pr-6 items-start shrink-0">
            {duplicatedBottom.map((item, index) => (
              <div key={`b1-${index}`} className={`w-[200px] sm:w-[280px] md:w-[380px] shrink-0 ${item.margin}`}>
                <div 
                  className={`w-full rounded-[1rem] sm:rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden shadow-sm ${item.aspect} bg-zinc-100 cursor-pointer relative group`}
                  onClick={() => { setCurrentImageIndex(item.originalIndex); setLightboxOpen(true); }}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10"></div>
                  <img src={item.img} alt="Gallery Bottom" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 sm:gap-4 md:gap-6 pr-3 sm:pr-4 md:pr-6 items-start shrink-0">
            {duplicatedBottom.map((item, index) => (
              <div key={`b2-${index}`} className={`w-[200px] sm:w-[280px] md:w-[380px] shrink-0 ${item.margin}`}>
                <div 
                  className={`w-full rounded-[1rem] sm:rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden shadow-sm ${item.aspect} bg-zinc-100 cursor-pointer relative group`}
                  onClick={() => { setCurrentImageIndex(item.originalIndex); setLightboxOpen(true); }}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10"></div>
                  <img src={item.img} alt="Gallery Bottom" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/95 backdrop-blur-md animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          {/* Top Bar matching Figma */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 text-zinc-400 z-50">
            <div className="text-sm font-medium tracking-widest pl-2">
              {currentImageIndex + 1} / {imagesList.length}
            </div>
            <div className="flex items-center gap-6 pr-2 z-[60]">
              <button 
                className={`transition-colors cursor-pointer ${isZoomed ? 'text-white' : 'hover:text-white'}`} 
                onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }} 
                title={isZoomed ? "Zoom Out" : "Zoom In"}
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button 
                className={`transition-colors cursor-pointer ${showGridView ? 'text-[#3B82F6]' : 'hover:text-white'}`} 
                onClick={(e) => { e.stopPropagation(); setShowGridView(!showGridView); }} 
                title="Toggle Grid View"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button className="hover:text-white transition-colors cursor-pointer" onClick={closeLightbox} title="Close">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Previous Arrow */}
          <button
            onClick={prevImage}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-zinc-900/60 hover:bg-zinc-800 text-white rounded flex items-center justify-center transition-all z-50 shadow-lg backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          {/* Next Arrow */}
          <button
            onClick={nextImage}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-zinc-900/60 hover:bg-zinc-800 text-white rounded flex items-center justify-center transition-all z-50 shadow-lg backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Image & Grid Layout Container */}
          <div 
            className="relative w-full h-full max-h-[100vh] flex pt-20 pb-4 px-4 md:px-16 overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Image Area */}
            <div className={`relative flex-1 h-full flex items-center justify-center overflow-hidden transition-all duration-300 ${showGridView ? 'pr-4 md:pr-8' : ''}`}>
              <div 
                className={`relative transition-transform duration-500 ease-out flex items-center justify-center w-full h-full ${isZoomed ? 'scale-[1.3] cursor-zoom-out' : 'scale-100 cursor-zoom-in'}`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={imagesList[currentImageIndex]}
                  alt={`Gallery Fullscreen ${currentImageIndex + 1}`}
                  className="max-w-full max-h-[85vh] object-contain shadow-2xl animate-in zoom-in-95 duration-300 select-none"
                />
              </div>
            </div>

            {/* Right Side Grid View Panel (Figma match) */}
            {showGridView && (
              <div className="w-[100px] sm:w-[180px] md:w-[260px] shrink-0 h-full overflow-y-auto hide-scrollbar rounded-xl animate-in slide-in-from-right-8 duration-300 z-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 pb-8">
                  {imagesList.map((imgUrl, idx) => (
                    <div 
                      key={idx}
                      onClick={() => { setCurrentImageIndex(idx); setIsZoomed(false); }}
                      className={`relative w-full aspect-[4/3] cursor-pointer rounded-lg overflow-hidden border-[3px] transition-all ${
                        currentImageIndex === idx 
                          ? 'border-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.6)] opacity-100 scale-[1.02]' 
                          : 'border-transparent hover:border-zinc-500 opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={imgUrl} 
                        alt={`Thumbnail ${idx + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </section>
  );
};

export default Gallery;