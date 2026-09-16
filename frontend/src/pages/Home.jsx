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
    </>
  );
};

export default Home;