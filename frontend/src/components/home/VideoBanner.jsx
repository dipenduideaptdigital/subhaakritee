import React, { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import defaultPlay from '../../assets/homepage/play.jpg';
import apiClient from '../../api/client';

const getEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) {
    return url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`;
  }

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
    } else {
      videoId = url;
    }
  } catch (e) {
    console.error('Error parsing YouTube URL:', e);
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
};

const VideoBanner = ({ data: externalData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState(externalData || null);
  const [coverImg, setCoverImg] = useState(defaultPlay);

  useEffect(() => {
    let isMounted = true;

    const processContent = (fetchedContent) => {
      if (isMounted) setContent(fetchedContent);
      const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';

      if (fetchedContent.image) {
        const imgUrl = fetchedContent.image.startsWith('http') ? fetchedContent.image : `${serverUrl}${fetchedContent.image}`;
        const img = new Image();
        img.src = imgUrl;
        img.onload = () => { if (isMounted) setCoverImg(imgUrl); };
        img.onerror = () => { if (isMounted) setCoverImg(defaultPlay); };
      } else if (isMounted) {
        setCoverImg(defaultPlay);
      }
    };

    if (externalData) {
      processContent(externalData);
      return () => { isMounted = false; };
    }

    const fetchVideoBannerData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_video_banner');
        const { data } = res;
        if (data.success && data.data?.content) {
          processContent(data.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch video banner content:', error);
      }
    };

    fetchVideoBannerData();

    return () => {
      isMounted = false;
    };
  }, [externalData]);

  const videoId = content?.videoId || "https://youtu.be/62bIsvRcPv0?si=Rw_dW3mB-EGrxooz";
  const title = content?.title || "UNLOCK YOUR DREAM \n HOME TODAY!";
  const description = content?.description || "We encourage clients to actively participate in discussions, share their ideas, preferences, and feedback.";

  const renderTitle = (titleText) => {
    if (!titleText) return null;
    return titleText.split(/\\n|\n/).map((line, index, arr) => (
      <React.Fragment key={index}>
        {line}
        {index < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  if (content?.isVisible === false) return null;
  
  return (
    <>
      <section className="relative w-full h-[360px] sm:h-[480px] md:h-[600px] lg:h-[720px] overflow-hidden group opal-move-up">

        {/* Background Image */}
        <img
          src={coverImg}
          alt="Office Interior Video Thumbnail"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          onError={(e) => {
            if (e.currentTarget.src !== defaultPlay) {
              e.currentTarget.src = defaultPlay;
            }
          }}
        />

        {/* Dark Overlays (Soft gradient from bottom for readability) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/90"></div>

        {/* Play Button (Centered, translucent white circle with solid play icon) */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-14 h-14 sm:w-24 sm:h-24 lg:w-[130px] lg:h-[130px] mb-8 sm:mb-16 lg:mb-30 rounded-full bg-white/30 backdrop-blur-xs flex items-center justify-center transition-transform hover:scale-105 hover:bg-white/40 cursor-pointer shadow-lg"
          >
            <Play className="w-6 h-6 sm:w-10 sm:h-10 lg:w-14 lg:h-14 text-white ml-1 lg:ml-3" fill="currentColor" />
          </button>
        </div>

        {/* Bottom Content Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 md:p-16 lg:pb-[70px] lg:pt-0 lg:px-[120px] z-20">

          {/* Headlines & Description */}
          <div className="w-full lg:max-w-[1153px]">
            <h2 className="text-xl sm:text-3xl md:text-5xl lg:text-[80px] font-bold text-white leading-tight sm:leading-tight md:leading-[70px] lg:leading-[120px] ml-0 sm:ml-5 font-helvetica uppercase tracking-normal">
              {renderTitle(title)}
              <span className="block lg:inline-block align-middle lg:ml-6 mt-3 lg:mt-0 max-w-[280px] sm:max-w-sm md:max-w-[420px]">
                <span className="block text-white text-xs sm:text-sm leading-relaxed font-normal font-helvetica opacity-90 normal-case tracking-normal whitespace-pre-line lg:-translate-y-3">
                  {description}
                </span>
              </span>
            </h2>
          </div>
        </div>
      </section>

      {/* Video Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-12 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white/70 hover:text-white flex items-center justify-center hover:bg-black/80 transition-colors border border-white/10 cursor-pointer"
              aria-label="Close video"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video IFrame */}
            <iframe
              className="w-full h-full"
              src={getEmbedUrl(videoId)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoBanner;