import React, { useState } from 'react';
import { Edit2, ChevronUp, ChevronDown } from 'lucide-react';
import TipTapEditor from '../components/admin/TipTapEditor';
import HeroSectionTwo from '../components/landing-design-2/HeroSectionTwo';
import AboutSectionTwo from '../components/landing-design-2/AboutSectionTwo';
import ServicesSectionTwo from '../components/landing-design-2/ServicesSectionTwo';
import ProcessSectionTwo from '../components/landing-design-2/ProcessSectionTwo';
import ProjectSliderTwo from '../components/landing-design-2/ProjectSliderTwo';
import TrustedPartners from '../components/landing-design-2/TrustedPartners';
import StatsSectionTwo from '../components/landing-design-2/StatsSectionTwo';
import HappySpaces from '../components/landing-design-2/HappySpaces';
import HappyCustomers from '../components/landing-design-2/HappyCustomers';
import TestimonialsTwo from '../components/landing-design-2/TestimonialsTwo';
import CtaSectionTwo from '../components/landing-design-2/CtaSectionTwo';
import ContactFormBlock from '../components/blocks/ContactFormBlock';
import ImageField from '../components/admin/ImageField';
import ServiceBannerBlock from '../components/blocks/ServiceBannerBlock';
import ServiceDetailsBlock from '../components/blocks/ServiceDetailsBlock';
import CtaSectionBlock from '../components/blocks/CtaSectionBlock';
import ContactBannerBlock from '../components/blocks/ContactBannerBlock';
import ContactInfoBlock from '../components/blocks/ContactInfoBlock';
import AboutBannerBlock from '../components/blocks/AboutBannerBlock';
import AboutExperienceBlock from '../components/blocks/AboutExperienceBlock';
import AboutProcessBlock from '../components/blocks/AboutProcessBlock';
import TimelineBlock from '../components/blocks/TimelineBlock';
import AboutAwardsBlock from '../components/blocks/AboutAwardsBlock';
import AboutGalleryBlock from '../components/blocks/AboutGalleryBlock';
import ProjectsHero from '../components/projects/ProjectsHero';

const CollapsibleTiptap = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPreviewText = (html) => {
    if (!html) return 'No content added...';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    return text.length > 50 ? text.substring(0, 50) + '...' : text || 'No content added...';
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-200">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors outline-none"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Edit2 className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="text-sm text-gray-600 truncate">
              {isOpen ? 'Close Editor' : getPreviewText(value)}
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
          )}
        </button>
        
        {isOpen && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <TipTapEditor value={value || ''} onChange={onChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export const puckConfig = {
  components: {
    heroSectionTwo: {
      fields: {
        title: { type: "textarea" },
        badgeText: { type: "text" },
        description: { 
          type: "custom", 
          render: ({ value, onChange }) => (
            <CollapsibleTiptap 
              label="Description" 
              value={value} 
              onChange={onChange} 
            />
          ) 
        },
        watermarkText: { type: "text" },
        backgroundImage: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: { 
        title: 'Find Your [Inspired]\n[Interior] Design',
        badgeText: 'FAST AND RELIABLE', 
        description: 'Transform your vision into reality with our innovative designs, creating modern spaces that blend functionality, aesthetics, and sustainability.', 
        watermarkText: 'Interior', 
        backgroundImage: '' 
      },
      render: (props) => <HeroSectionTwo data={props} />
    },
    aboutSectionTwo: {
      fields: {
        title: { type: "textarea" },
        badgeText: { type: "text" },
        paragraph1: { 
          type: "custom", 
          render: ({ value, onChange }) => (
            <CollapsibleTiptap 
              label="Paragraph 1" 
              value={value} 
              onChange={onChange} 
            />
          ) 
        },
        paragraph2: { 
          type: "custom", 
          render: ({ value, onChange }) => (
            <CollapsibleTiptap 
              label="Paragraph 2" 
              value={value} 
              onChange={onChange} 
            />
          ) 
        },
        buttonText: { type: "text" },
        image1: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> },
        image2: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> },
        image3: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: { 
        title: 'Architecture\n[And Interiors, Our Dual]\nExpertise',
        badgeText: 'STARTED IN 1989', 
        paragraph1: 'We believe that every space has the power to inspire, and that great design brings that inspiration to life. Our mission is to craft environments that stir creativity, evoke emotion, and reflect the essence of those who inhabit them.', 
        paragraph2: 'With a strong presence in Kolkata, Bhubaneswar, and Ranchi, our turnkey office interiors are thoughtfully crafted to enhance productivity, reflect your brand identity, and support the way your team works every day.', 
        buttonText: "Let's Get Started", 
        image1: '', 
        image2: '', 
        image3: '' 
      },
      render: (props) => <AboutSectionTwo data={props} />
    },
    servicesSectionTwo: {
      fields: {
        title: { type: "textarea" },
        badgeText: { type: "text" },
        services: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            description: { 
              type: "custom", 
              render: ({ value, onChange }) => (
                <CollapsibleTiptap 
                  label="Description" 
                  value={value} 
                  onChange={onChange} 
                />
              ) 
            },
            
            image: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> }
          },
          defaultItemProps: { title: 'Initial Consultation', description: '<p>We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.</p>', image: '' }
        }
      },
      defaultProps: { 
        title: 'Explore Our [Comprehensive]\n[Interior Design] Services',
        badgeText: 'OUR SERVICES', 
        services: [
          { title: 'Initial Consultation', description: '<p>We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.</p>', image: '' },
          { title: 'Design & Planning', description: '<p>We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.</p>', image: '' },
          { title: 'Implementation', description: '<p>We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.</p>', image: '' }
        ] 
      },
      render: (props) => <ServicesSectionTwo data={props} />
    },

    processSectionTwo: {
      fields: {
        title: { type: "textarea" },
        badgeText: { type: "text" },
        description: { 
          type: "custom", 
          render: ({ value, onChange }) => (
            <CollapsibleTiptap 
              label="Description" 
              value={value} 
              onChange={onChange} 
            />
          ) 
        },
        image: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> },
        steps: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            description: { type: "textarea" }
          },
          defaultItemProps: { title: 'Step title', description: 'Step description...' }
        }
      },
      defaultProps: { 
        title: 'Description [Architecture]\n[Process] For Exceptional Results.',
        badgeText: 'GET IN TOUCH', 
        description: 'We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.', 
        image: '',
        steps: [
          { title: 'Initial Consultation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' },
          { title: 'Design & Planning', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' },
          { title: 'Implementation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' },
          { title: 'Project Handover', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' }
        ] 
      },
      render: (props) => <ProcessSectionTwo data={props} />
    },
    projectSliderTwo: {
      fields: {
        projects: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            year: { type: "text" },
            location: { type: "text" },
            image: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> }
          },
          defaultItemProps: { title: 'Project Title', year: '2024', location: 'Location', image: '' }
        }
      },
      defaultProps: { 
        projects: [
          { title: 'Industrial Elegance Condo', year: '2024', location: 'Kolkata', image: '' },
          { title: 'Residential Interior Design', year: '2024', location: 'Bhubaneswar', image: '' },
          { title: 'Serene Space Studio', year: '2024', location: 'Ranchi', image: '' },
          { title: 'Art Decor Revival', year: '2024', location: 'Kolkata', image: '' },
          { title: 'Modern Minimalist Oasis', year: '2024', location: 'Siliguri', image: '' },
          { title: 'Corporate Executive Suite', year: '2024', location: 'Delhi', image: '' }
        ] 
      },
      render: (props) => <ProjectSliderTwo data={props} />
    },
    trustedPartners: {
      fields: {
        title: { type: "text" },
        partners: {
          type: "array",
          arrayFields: {
            name: { type: "text" },
            logo: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> },
            heightClass: { 
              type: "select", 
              options: [
                { label: 'Medium (h-11)', value: 'h-11 md:h-[44px]' },
                { label: 'Large (h-12)', value: 'h-12 md:h-[48px]' },
                { label: 'X-Large (h-14)', value: 'h-[54px] md:h-[60px]' }
              ] 
            }
          },
          defaultItemProps: { name: 'Brand Name', logo: '', heightClass: 'h-11 md:h-[44px]' }
        }
      },
      defaultProps: {
        title: 'OUR [TRUSTED PARTNERS]',
        partners: [
          { name: 'Aristo', logo: '', heightClass: 'h-11 md:h-[44px]' },
          { name: 'Spitze', logo: '', heightClass: 'h-12 md:h-[48px]' },
          { name: 'Faber', logo: '', heightClass: 'h-11 md:h-[44px]' },
          { name: 'Everyday', logo: '', heightClass: 'h-12 md:h-[48px]' },
          { name: 'Fevicol', logo: '', heightClass: 'h-[54px] md:h-[60px]' },
          { name: 'Urban Ladder', logo: '', heightClass: 'h-11 md:h-[44px]' }
        ]
      },
      render: (props) => <TrustedPartners data={props} />
    },
    statsSectionTwo: {
      fields: {
        title: { type: "textarea" },
        badgeText: { type: "text" },
        buttonText: { type: "text" },
        backgroundImage: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> },
        stats: {
          type: "array",
          arrayFields: {
            value: { type: "text" },
            title: { type: "text" },
            description: { type: "textarea" }
          },
          defaultItemProps: { value: '0', title: 'Stat Label', description: 'Stat description...' }
        }
      },
      defaultProps: { 
        title: 'Behind [Every Statistic]\n[Pulses] A Human Story',
        badgeText: 'TRUSTED EXPERIENCE', 
        buttonText: 'BOOK A FREE CONSULTATION',
        backgroundImage: '',
        stats: [
          { value: '26+', title: 'YEARS EXPERIENCE', description: 'Improving homes with expert craftsmanship for years' },
          { value: '100', title: 'PROJECTS DONE', description: 'Over 250 successful projects delivered with quality and care' },
          { value: '100', title: 'SATISFIED CUSTOMER', description: 'Our team of 30 experts ensures top-quality results' },
          { value: '4+', title: 'LOCATION', description: 'All of our clients are satisfied with our work and service' }
        ] 
      },
      render: (props) => <StatsSectionTwo data={props} />
    },
    happySpaces: {
      fields: {
        badgeText: { type: "text" },
        titleLine1: { type: "text" },
        titleLine2: { type: "text" },
        items: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            description: { 
              type: "custom", 
              render: ({ value, onChange }) => (
                <CollapsibleTiptap 
                  label="Description" 
                  value={value} 
                  onChange={onChange} 
                />
              ) 
            },
            
            image: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> },
            videoUrl: { type: "text" }
          },
          defaultItemProps: { title: 'Feature title', description: 'Feature description...', image: '', videoUrl: '' }
        }
      },
      defaultProps: { 
        badgeText: 'STRAIGHT FROM THE NEWSROOM', 
        titleLine1: 'Happy Spaces by', 
        titleLine2: 'subhAAkritee',
        items: [
          { title: 'Functional Design Trends That Blend Style And Comfort', description: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: '', videoUrl: 'https://www.youtube.com/embed/62bIsvRcPv0' },
          { title: 'Functional Design Trends That Blend Style And Comfort', description: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: '', videoUrl: 'https://www.youtube.com/embed/62bIsvRcPv0' },
          { title: 'Functional Design Trends That Blend Style And Comfort', description: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: '', videoUrl: 'https://www.youtube.com/embed/62bIsvRcPv0' }
        ] 
      },
      render: (props) => <HappySpaces data={props} />
    },
    happyCustomers: {
      fields: {
        title: { type: "text" },
        partners: {
          type: "array",
          arrayFields: {
            name: { type: "text" },
            logo: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> },
            heightClass: { 
              type: "select", 
              options: [
                { label: 'Medium (h-11)', value: 'h-11 md:h-[44px]' },
                { label: 'Large (h-12)', value: 'h-12 md:h-[48px]' },
                { label: 'X-Large (h-14)', value: 'h-[54px] md:h-[60px]' }
              ] 
            }
          },
          defaultItemProps: { name: 'Brand Name', logo: '', heightClass: 'h-11 md:h-[44px]' }
        }
      },
      defaultProps: {
        title: 'OUR [HAPPY CUSTOMERS]',
        partners: [
          { name: 'Aristo', logo: '', heightClass: 'h-11 md:h-[44px]' },
          { name: 'Spitze', logo: '', heightClass: 'h-12 md:h-[48px]' },
          { name: 'Faber', logo: '', heightClass: 'h-11 md:h-[44px]' },
          { name: 'Everyday', logo: '', heightClass: 'h-12 md:h-[48px]' },
          { name: 'Fevicol', logo: '', heightClass: 'h-[54px] md:h-[60px]' },
          { name: 'Urban Ladder', logo: '', heightClass: 'h-11 md:h-[44px]' }
        ]
      },
      render: (props) => <HappyCustomers data={props} />
    },
    testimonialsTwo: {
      fields: {
        title: { type: "textarea" },
        badgeText: { type: "text" },
        description: { 
          type: "custom", 
          render: ({ value, onChange }) => (
            <CollapsibleTiptap 
              label="Description" 
              value={value} 
              onChange={onChange} 
            />
          ) 
        },
        mainQuote: { type: "textarea" },
        authorName: { type: "text" },
        authorRole: { type: "text" },
        image: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> },
        authorImage: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: { 
        title: 'Here’s What [Warm Words]\n[Our Clients] Say',
        badgeText: 'OUR CLIENTS SAY', 
        description: 'Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces functional and stylish commercial interiors', 
        mainQuote: 'I absolutely love my the new modern living room! The clean lines, a neutral tones, and minimalist interior create such a calming & stylish atmosphere. Highly recommend their modern interior design services!', 
        authorName: 'Morgan Dufresne', 
        authorRole: 'Company owner', 
        image: '', 
        authorImage: '' 
      },
      render: (props) => <TestimonialsTwo data={props} />
    },
    ctaSectionTwo: {
      fields: {
        title: { type: "textarea" },
        badgeText: { type: "text" },
        buttonText: { type: "text" }
      },
      defaultProps: { 
        title: 'Have A Project In [Mind?] Let’s\n[Make] It Happen',
        badgeText: 'GET IN TOUCH', 
        buttonText: 'BOOK A FREE CONSULTATION' 
      },
      render: (props) => <CtaSectionTwo data={props} />
    },
    contactForm: {
      fields: {
        formId: { type: "text" },
        formTitle: { type: "text" },
        submitButtonText: { type: "text" },
        redirectPath: { type: "text" }
      },
      defaultProps: { formId: '', formTitle: 'Get in Touch', submitButtonText: 'Submit Inquiry', redirectPath: '' },
      render: (props) => <ContactFormBlock data={props} />
    },
    richText: {
      fields: { 
        content: { 
          type: "custom", 
          render: ({ value, onChange }) => (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <TipTapEditor value={value || ''} onChange={onChange} />
            </div>
          ) 
        } 
      },
      defaultProps: { content: '<p>Enter your text here.</p>' },
      render: (props) => (
        <div className="py-12 md:py-24 overflow-hidden w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
            <div 
              className="prose prose-zinc sm:prose-lg max-w-none w-full mx-auto prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl prose-img:w-full break-words overflow-x-auto hide-scrollbar"
              dangerouslySetInnerHTML={{ __html: props.content || '' }}
            />
          </div>
        </div>
      )
    },
    serviceBanner: {
      fields: {
        title: { type: "text" },
        subTitle: { type: "text" },
        backgroundImage: { 
          type: "custom", 
          render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> 
        }
      },
      defaultProps: {
        title: "Residential Interior",
        subTitle: "Services",
        backgroundImage: ""
      },
      render: ({ title, subTitle, backgroundImage }) => (
        <ServiceBannerBlock 
          title={title} 
          subTitle={subTitle} 
          backgroundImage={backgroundImage} 
        />
      )
    },

    serviceDetails: {
      fields: {
        sidebarServices: {
          type: "array",
          arrayFields: {
            name: { type: "text" },
            path: { type: "text" },
            active: { type: "radio", options: [{ label: "Yes", value: true }, { label: "No", value: false }] }
          },
        },
        sidebarImage: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> },
        mainImage: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> },
        aboutTitle: { type: "text" },
        aboutDescription: { 
          type: "custom", 
          render: ({ value, onChange }) => (
            <CollapsibleTiptap 
              label="About Description" 
              value={value} 
              onChange={onChange} 
            />
          ) 
        },
        features: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            description: { type: "textarea" }
          }
        },
        midImage1: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> },
        midImage2: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> },
        typesTitle: { type: "text" },
        typesDescription: { 
          type: "custom", 
          render: ({ value, onChange }) => (
            <CollapsibleTiptap 
              label="Types Description" 
              value={value} 
              onChange={onChange} 
            />
          ) 
        },
        elementsTitle: { type: "text" },
        elementsDescription: { 
          type: "custom", 
          render: ({ value, onChange }) => (
            <CollapsibleTiptap 
              label="Elements Description" 
              value={value} 
              onChange={onChange} 
            />
          ) 
        },
        leftBullets: {
          type: "array",
          arrayFields: { text: { type: "text" } }
        },
        rightBullets: {
          type: "array",
          arrayFields: { text: { type: "text" } }
        },
        footerDescription: { 
          type: "custom", 
          render: ({ value, onChange }) => (
            <CollapsibleTiptap 
              label="Footer Description" 
              value={value} 
              onChange={onChange} 
            />
          ) 
        },
        faqs: {
          type: "array",
          arrayFields: { 
            question: { type: "text" },
            answer: { type: "textarea" }
          },
          defaultItemProps: { question: 'Question?', answer: 'Answer goes here...' }
        }
      },
      defaultProps: {
        aboutTitle: "About The Service",
        aboutDescription: "<p>Commercial interior design is constantly evolving...</p>",
        typesTitle: "Types Of Commercial Spaces",
        typesDescription: "<p>In design, we bring characteristics...</p>",
        elementsTitle: "Key Elements Of Interior Design",
        elementsDescription: "<p>Several key elements are essential...</p>",
        footerDescription: "<p>Commercial interior design is a dynamic...</p>",
        sidebarServices: [
          { name: 'Renovation And Remodelling', path: '/services/commercial', active: true }
        ],
        features: [
          { title: "Space Optimization", description: "Through The Best Smart Space Optimisation." }
        ],
        leftBullets: [{ text: "We provide high quality design services." }],
        rightBullets: [{ text: "Flexible with any structure of the building" }],
        faqs: [{ question: "What Interior Design Services Do You Offer?", answer: "We offer comprehensive residential and commercial interior design services tailored to your needs." }]
      },
      render: (props) => <ServiceDetailsBlock {...props} />
    },
    ctaSection: {
      fields: {
        badgeText: { type: "text" },
        title: { type: "textarea" },
        buttonText: { type: "text" }
      },
      defaultProps: {
        badgeText: "GET IN TOUCH",
        title: "Have A Project In [Mind? Let's]\n[Make] It Happen",
        buttonText: "BOOK A FREE CONSULTATION"
      },
      render: (props) => <CtaSectionBlock {...props} />
    },
    contactBanner: {
      fields: {
        title: { type: "text" },
        breadcrumbText: { type: "text" },
        backgroundImage: { 
          type: "custom", 
          render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> 
        }
      },
      defaultProps: {
        title: "Contact Us",
        breadcrumbText: "Contact Us",
        backgroundImage: ""
      },
      render: (props) => <ContactBannerBlock {...props} />
    },
    contactInfo: {
      fields: {
        badgeText: { type: "text" },
        title: { type: "textarea" },
        addressTitle: { type: "text" },
        addressText: { type: "textarea" },
        supportTitle: { type: "text" },
        supportPhone: { type: "text" },
        supportEmail: { type: "text" },
        workspaceImage: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> },
        mapIframeUrl: { type: "textarea" },
        formId: { type: "text" }
      },
      defaultProps: {
        badgeText: 'GET IN TOUCH',
        title: "Have a Project In [Mind? Let's]\n[Make] It Happen.",
        addressTitle: 'Address:',
        addressText: 'Office: AG 40 , Sector II, Salt Lake\nCity, Kolkata: 700091',
        supportTitle: 'Support',
        supportPhone: '+91 9831-637-409',
        supportEmail: 'Subhaakritee@Hotmail.Com',
        workspaceImage: '',
        mapIframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.2750390190535!2d88.4239845759714!3d22.568803433116515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275adab7574c3%3A0xc34375b42d334df5!2sSubhaakritee!5e0!3m2!1sen!2sin!4v1709123456789!5m2!1sen!2sin', // Default Google Map URL
        formId: 'cmqzjpzfz0000t00s7pd31okk'
      },
      render: (props) => <ContactInfoBlock {...props} />
    },

    aboutBanner: {
      fields: {
        title: { type: "text" },
        breadcrumbText: { type: "text" },
        backgroundImage: { 
          type: "custom", 
          render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> 
        }
      },
      defaultProps: { title: "About Us", breadcrumbText: "About Us", backgroundImage: "" },
      render: (props) => <AboutBannerBlock {...props} />
    },
    
    aboutExperience: {
      fields: {
        badgeText: { type: "text" },
        title: { type: "textarea" },
        yearsOfExperience: { type: "text" },
        experienceTitle: { type: "textarea" },
        paragraph: { 
          type: "custom", 
          render: ({ onChange, value }) => (
            <CollapsibleTiptap 
              label="Experience Description" 
              value={value} 
              onChange={onChange} 
            />
          )
        },
        
        buttonText: { type: "text" },
        buttonLink: { type: "text" },
        image1: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> },
        image2: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: {
        badgeText: "Started in 1989",
        title: "We Shape [Interior Designs,]\n[Crafting Timeless] And Inspiring\nSpaces",
        yearsOfExperience: "26",
        experienceTitle: "Years Of\nExperience",
        paragraph: "<p>We believe that every space has the power to inspire, and that great design brings that integration to life. Our mission is to craft environments that stir creativity, evoke emotion, and reflect the essence of those who inhabit them.</p>",
        buttonText: "Learn More",
        buttonLink: "#",
        image1: "",
        image2: ""
      },
      render: (props) => <AboutExperienceBlock {...props} />
    },

    aboutProcess: {
      fields: {
        backgroundImage: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> },
        steps: {
          type: "array",
          arrayFields: {
            number: { type: "text" },
            title: { type: "text" },
            desc: { type: "textarea" }
          },
          defaultItemProps: { number: '01', title: 'Step Title', desc: 'Description' }
        }
      },
      defaultProps: {
        backgroundImage: "",
        steps: [
          { number: '01', title: 'Concept Design', desc: 'Initial ideation and space planning.' },
          { number: '02', title: 'Space Planning', desc: 'Detailed layout and functionality.' },
          { number: '03', title: 'Design Execution', desc: 'Crafting and site management.' },
          { number: '04', title: 'Final Finishing', desc: 'Polished results and handover.' }
        ]
      },
      render: (props) => <AboutProcessBlock {...props} />
    },

    timeline: {
      fields: {
        badgeText: { type: "text" },
        title: { type: "textarea" },
        items: {
          type: "array",
          arrayFields: {
            year: { type: "text" },
            description: { type: "textarea" },
            image: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> }
          },
          defaultItemProps: { year: '2025', description: 'Description here...', image: '' }
        }
      },
      defaultProps: {
        badgeText: "GET IN TOUCH",
        title: "Our History [Is Full Of]\n[Interesting] Stages And\nEvents.",
        items: [
          { year: '1990', description: 'A business house born out of passion for fish keeping.', image: '' },
          { year: '2010', description: 'Expanded our operations to new territories.', image: '' }
        ]
      },
      render: (props) => <TimelineBlock {...props} />
    },
    
    aboutAwards: {
      fields: {
        badgeText: { type: "text" },
        title: { type: "textarea" },
        mainImage: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> },
        awards: {
          type: "array",
          arrayFields: {
            year: { type: "text" },
            title: { type: "text" }
          },
          defaultItemProps: { year: '2025', title: 'Award Title' }
        }
      },
      defaultProps: {
        badgeText: "AWARD & ACHIEVEMENT",
        title: "Design That [Speaks Our]\n[Industry] Awards",
        mainImage: "",
        awards: [
          { year: '2020', title: 'Residential Interior Design' },
          { year: '2021', title: 'Outdoor & Landscape Design' }
        ]
      },
      render: (props) => <AboutAwardsBlock {...props} />
    },

    aboutGallery: {
      fields: {
        backgroundImage: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> },
        badgeText: { type: "text" },
        title: { type: "textarea" },
        description: { 
          type: "custom", 
          render: ({ value, onChange }) => (
            <CollapsibleTiptap 
              label="Description" 
              value={value} 
              onChange={onChange} 
            />
          ) 
},
        galleryItems: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            image: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> }
          },
          defaultItemProps: { title: 'Project Title', image: '' }
        }
      },
      defaultProps: {
        backgroundImage: "",
        badgeText: "OUR GALLERY",
        title: "Interior \n Design",
        description: "<p>Lorem ipsum dolor sit amet consectetur. Magna nunc porttitor convallis faucibus laoreet.</p>",
        galleryItems: [
          { title: 'Project 1', image: '' },
          { title: 'Project 2', image: '' },
          { title: 'Project 3', image: '' },
          { title: 'Project 4', image: '' }
        ]
      },
      render: (props) => <AboutGalleryBlock {...props} />
    },
    
    projectsBanner: {
      fields: {
        title: { type: "text" },
        backgroundImage: { 
          type: "custom", 
          render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> 
        }
      },
      defaultProps: {
        title: "Projects",
        backgroundImage: ""
      },
      render: (props) => <ProjectsHero title={props.title} backgroundImage={props.backgroundImage} />
    },
  }
};