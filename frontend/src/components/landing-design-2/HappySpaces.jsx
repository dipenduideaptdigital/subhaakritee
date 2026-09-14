import React, { useState } from 'react';
import { X } from 'lucide-react';
import img1 from '../../assets/homepage/view.jpg';
import img2 from '../../assets/homepage/about_img.png';
import img3 from '../../assets/homepage/gallery5.png';
import playButtonImg from '../../assets/logos/play_button.png';

const getAssetUrl = (path, fallback) => {
  if (!path) return fallback;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const getEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;
  
  let videoId = '';
  try {
    if (url.includes('youtu.be/')) {
      const parts = url.split('youtu.be/');
      if (parts[1]) {
        videoId = parts[1].split('?')[0].split('&')[0];
      }
    } else if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v');
    }
  } catch (e) {
    console.error('Error parsing YouTube URL:', e);
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

const HappySpaces = ({ data }) => {
  const [activeVideo, setActiveVideo] = useState(null);

  const resolvedImg1 = data?.items?.[0]?.image ? getAssetUrl(data.items[0].image, img1) : img1;
  const resolvedImg2 = data?.items?.[1]?.image ? getAssetUrl(data.items[1].image, img2) : img2;
  const resolvedImg3 = data?.items?.[2]?.image ? getAssetUrl(data.items[2].image, img3) : img3;

  const spacesList = [
    {
      id: 1,
      title: data?.items?.[0]?.title || 'Functional Design Trends That Blend Style And Comfort',
      desc: data?.items?.[0]?.description || '<p>Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.</p>',
      image: resolvedImg1,
      videoUrl: data?.items?.[0]?.videoUrl || 'https://www.youtube.com/embed/62bIsvRcPv0',
    },
    {
      id: 2,
      title: data?.items?.[1]?.title || 'Functional Design Trends That Blend Style And Comfort',
      desc: data?.items?.[1]?.description || '<p>Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.</p>',
      image: resolvedImg2,
      videoUrl: data?.items?.[1]?.videoUrl || 'https://www.youtube.com/embed/62bIsvRcPv0',
    },
    {
      id: 3,
      title: data?.items?.[2]?.title || 'Functional Design Trends That Blend Style And Comfort',
      desc: data?.items?.[2]?.description || '<p>Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.</p>',
      image: resolvedImg3,
      videoUrl: data?.items?.[2]?.videoUrl || 'https://www.youtube.com/embed/62bIsvRcPv0',
    },
  ];

  return (
    <section id="blog" className="py-20 md:py-24 bg-white text-gray-900 font-helvetica overflow-hidden relative select-none">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl">
        
        {/* Header containing Badge and Centered Title */}
        <div className="relative mb-16 md:mb-20 flex flex-col md:block">
          {/* Badge aligned to the left and centered vertically with the first line of the title */}
          <div className="md:absolute left-0 top-0 md:top-[16px] lg:top-[20px] mb-6 md:mb-0 inline-block shrink-0">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300 bg-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] md:text-[11px] font-bold tracking-widest text-gray-700 uppercase">
                {data?.badgeText || 'STRAIGHT FROM THE NEWSROOM'}
              </span>
            </div>
          </div>

          {/* Centered Heading */}
          <div className="w-full text-center">
            <h2 className="text-4xl md:text-[70px] font-bold text-gray-950 tracking-[0em] leading-tight md:leading-[74px] font-sans">
              {data?.titleLine1 || 'Happy Spaces by'}<br />
              <span className="text-[#ffc300]">{data?.titleLine2 || 'subhAAkritee'}</span>
            </h2>
          </div>
        </div>

        {/* 3-Column Video Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {spacesList.map((item) => (
            <div 
              key={item.id} 
              className="group cursor-pointer flex flex-col text-left"
              onClick={() => setActiveVideo(item.videoUrl)}
            >
              {/* Image Container with Rounded Corners and Play Icon Overlay */}
              <div className="relative aspect-[16/10] w-full rounded-[28px] md:rounded-[32px] overflow-hidden mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] bg-gray-100 border border-gray-100">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  onError={(e) => {
                    const fallbacks = [img1, img2, img3];
                    e.currentTarget.src = fallbacks[item.id - 1] || img1;
                  }}
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                  <img 
                    src={playButtonImg} 
                    alt="Play Video" 
                    className="w-16 h-16 md:w-20 md:h-20 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
                  />
                </div>
              </div>

              {/* Text Info */}
              <div className="px-1">
                <h3 className="text-[19px] md:text-[20px] font-bold text-gray-950 mb-3.5 leading-snug group-hover:text-[#ffc300] transition-colors duration-300">
                  {item.title}
                </h3>
                <div 
                  className="text-gray-500 text-[13.5px] md:text-[14px] leading-relaxed font-normal prose prose-sm max-w-none prose-p:my-1 prose-a:text-[#ffc300] hover:prose-a:text-[#e6b000] [&_strong]:text-gray-900 [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: item.desc }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Modal Player Overlay */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <div 
            className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors border border-white/10"
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video IFrame */}
            <iframe 
              src={getEmbedUrl(activeVideo)} 
              title="Happy Spaces Tour" 
              className="w-full h-full"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
};

export default HappySpaces;