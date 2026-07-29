import React, { useEffect, Suspense, lazy, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import apiClient from '../api/client';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';

const AboutSection = lazy(() => import('../components/home/AboutSection'));
const OurServices = lazy(() => import('../components/home/OurServices'));
const OurProjects = lazy(() => import('../components/home/OurProjects'));
const HowWeWork = lazy(() => import('../components/home/HowWeWork'));
const Panoramas = lazy(() => import('../components/home/Panoramas'));
const Team = lazy(() => import('../components/home/Team'));
const Testimonials = lazy(() => import('../components/home/Testimonials'));
const VideoBanner = lazy(() => import('../components/home/VideoBanner'));
const BlogSection = lazy(() => import('../components/home/BlogSection'));
const Gallery = lazy(() => import('../components/home/Gallery'));
const CtaSection = lazy(() => import('../components/home/CtaSection'));

const SectionFallback = () => (
  <div className="w-full h-48 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

const Home = () => {
  useScrollAnimation();
  const location = useLocation();
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [isBackToTopEnabled, setIsBackToTopEnabled] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiClient.get('/cms/section/global_general_settings');
        const content = res.data?.data?.content || res.data?.content;
        if (content) {
          setIsBackToTopEnabled(content.showBackToTop === false || content.showBackToTop === 'false' ? false : true);
        }
      } catch (error) {
        console.error('Failed to load general settings:', error);
      }
    };
    fetchSettings();
  }, []);

  // Scroll Track Logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1000) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 0; 
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <>
      <Hero />
      <Services />
      
      <Suspense fallback={<SectionFallback />}>
        <div id="about">
          <AboutSection />
        </div>
        
        <div id="services">
          <OurServices />
        </div>
        
        <div id="process">
          <HowWeWork />
        </div>
        
        <div id="projects">
          <OurProjects />
        </div>
        
        <Testimonials />
        <Panoramas />
        <Team />
        <VideoBanner />
        
        <div id="blog">
          <BlogSection />
        </div>
        
        <Gallery />
        <CtaSection />
      </Suspense>

      {/* Back to Top Button */}
      {isBackToTopEnabled && (
        <div
          className={`fixed bottom-28 right-6 z-[90] transition-all duration-500 ${
            showTopBtn ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-10 invisible'
          }`}
        >
        <button
          onClick={scrollToTop}
          className="flex items-center justify-center p-3.5 rounded-full bg-white/10 backdrop-blur-lg border border-white/40 text-[#3B82F6] shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:bg-white/20 transition-all duration-300 cursor-pointer animate-bounce"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" strokeWidth={2.5} />
        </button>
      </div>
      )}
    </>
  );
};

export default Home;