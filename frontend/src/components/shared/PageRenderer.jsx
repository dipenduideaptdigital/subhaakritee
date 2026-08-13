import React, { memo } from 'react';
import Hero from '../home/Hero';
import Services from '../home/Services';
import AboutSection from '../home/AboutSection';
import OurServices from '../home/OurServices';
import HowWeWork from '../home/HowWeWork';
import OurProjects from '../home/OurProjects';
import Panoramas from '../home/Panoramas';
import Team from '../home/Team';
import Testimonials from '../home/Testimonials';
import VideoBanner from '../home/VideoBanner';
import BlogSection from '../home/BlogSection';
import Gallery from '../home/Gallery';
import CtaSection from '../home/CtaSection';
import ContactFormBlock from '../blocks/ContactFormBlock';
import ContactBannerBlock from '../blocks/ContactBannerBlock';
import ContactInfoBlock from '../blocks/ContactInfoBlock';
import HeroSectionTwo from '../landing-design-2/HeroSectionTwo';
import AboutSectionTwo from '../landing-design-2/AboutSectionTwo';
import ServicesSectionTwo from '../landing-design-2/ServicesSectionTwo';
import ProcessSectionTwo from '../landing-design-2/ProcessSectionTwo';
import ProjectSliderTwo from '../landing-design-2/ProjectSliderTwo';
import TrustedPartners from '../landing-design-2/TrustedPartners';
import StatsSectionTwo from '../landing-design-2/StatsSectionTwo';
import HappySpaces from '../landing-design-2/HappySpaces';
import HappyCustomers from '../landing-design-2/HappyCustomers';
import TestimonialsTwo from '../landing-design-2/TestimonialsTwo';
import CtaSectionTwo from '../landing-design-2/CtaSectionTwo';
import ServiceBannerBlock from '../blocks/ServiceBannerBlock';
import ServiceDetailsBlock from '../blocks/ServiceDetailsBlock';
import CtaSectionBlock from '../blocks/CtaSectionBlock';
import AboutBannerBlock from '../blocks/AboutBannerBlock';
import AboutExperienceBlock from '../blocks/AboutExperienceBlock';
import AboutProcessBlock from '../blocks/AboutProcessBlock';
import TimelineBlock from '../blocks/TimelineBlock';
import AboutAwardsBlock from '../blocks/AboutAwardsBlock';
import AboutGalleryBlock from '../blocks/AboutGalleryBlock';
import ProjectsHero from '../projects/ProjectsHero';

const BlockMapper = memo(({ block, index }) => {
  const { type, data } = block;
  
  if (data?.isVisible === false) return null;

  switch (type) {
    case 'hero': return <Hero key={index} data={data} />;
    case 'services': return <Services key={index} data={data} />;
    case 'about': return <AboutSection key={index} data={data} />;
    case 'our_services': return <OurServices key={index} data={data} />;
    case 'how_we_work': return <HowWeWork key={index} data={data} />;
    case 'our_projects': return <OurProjects key={index} data={data} />;
    case 'panoramas': return <Panoramas key={index} data={data} />;
    case 'team': return <Team key={index} data={data} />;
    case 'testimonials': return <Testimonials key={index} data={data} />;
    case 'video_banner': return <VideoBanner key={index} data={data} />;
    case 'blog_section': return <BlogSection key={index} data={data} />;
    case 'gallery': return <Gallery key={index} data={data} />;
    case 'cta': return <CtaSection key={index} data={data} />;
    case 'contactForm': return <ContactFormBlock key={index} data={data} />;
    case 'contactBanner': return <ContactBannerBlock key={index} {...data} />;
    case 'contactInfo': return <ContactInfoBlock key={index} {...data} />;
    case 'serviceBanner': return <ServiceBannerBlock key={index} {...data} />;
    case 'serviceDetails': return <ServiceDetailsBlock key={index} {...data} />;
    case 'ctaSection': return <CtaSectionBlock key={index} {...data} />;
    case 'aboutBanner': return <AboutBannerBlock key={index} {...data} />;
    case 'aboutExperience': return <AboutExperienceBlock key={index} {...data} />;
    case 'aboutProcess': return <AboutProcessBlock key={index} {...data} />;
    case 'timeline': return <TimelineBlock key={index} {...data} />;
    case 'aboutAwards': return <AboutAwardsBlock key={index} {...data} />;
    case 'aboutGallery': return <AboutGalleryBlock key={index} {...data} />;
    case 'heroSectionTwo': return <HeroSectionTwo key={index} data={data} />;
    case 'aboutSectionTwo': return <AboutSectionTwo key={index} data={data} />;
    case 'servicesSectionTwo': return <ServicesSectionTwo key={index} data={data} />;
    case 'processSectionTwo': return <ProcessSectionTwo key={index} data={data} />;
    case 'projectSliderTwo': return <ProjectSliderTwo key={index} data={data} />;
    case 'trustedPartners': return <TrustedPartners key={index} data={data} />;
    case 'statsSectionTwo': return <StatsSectionTwo key={index} data={data} />;
    case 'happySpaces': return <HappySpaces key={index} data={data} />;
    case 'happyCustomers': return <HappyCustomers key={index} data={data} />;
    case 'testimonialsTwo': return <TestimonialsTwo key={index} data={data} />;
    case 'ctaSectionTwo': return <CtaSectionTwo key={index} data={data} />;
    case 'projectsBanner': return <ProjectsHero key={index} {...data} />;
    case 'richText':
      return (
        <div key={index} className="py-12 md:py-24 overflow-hidden w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
            <div 
              className="prose prose-zinc sm:prose-lg max-w-none w-full mx-auto prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl prose-img:w-full break-words overflow-x-auto hide-scrollbar"
              dangerouslySetInnerHTML={{ __html: data?.content || '' }}
            />
          </div>
        </div>
      );
    default:
      return null;
  }
});

const PageRenderer = memo(({ blocks }) => {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-center text-zinc-500 italic">
          This page is currently empty.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      {blocks.map((block, index) => (
        <BlockMapper key={block.id || index} block={block} index={index} />
      ))}
    </div>
  );
});

export default PageRenderer;