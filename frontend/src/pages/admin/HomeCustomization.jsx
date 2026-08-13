import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Save, Image as ImageIcon, Loader2, CheckCircle, List, User, Settings, FileText, Send, ChevronDown } from 'lucide-react';
import HeroCustomization from '../../components/admin/HeroCustomization';
import ServicesCustomization from '../../components/admin/ServicesCustomization';
import AboutCustomization from '../../components/admin/AboutCustomization';
import OurServicesCustomization from '../../components/admin/OurServicesCustomization';
import HowWeWorkCustomization from '../../components/admin/HowWeWorkCustomization';
import OurProjectsCustomization from '../../components/admin/OurProjectsCustomization';
import PanoramasCustomization from '../../components/admin/PanoramasCustomization';
import TeamCustomization from '../../components/admin/TeamCustomization';
import TestimonialsCustomization from '../../components/admin/TestimonialsCustomization';
import VideoBannerCustomization from '../../components/admin/VideoBannerCustomization';
import BlogSectionCustomization from '../../components/admin/BlogSectionCustomization';
import GalleryCustomization from '../../components/admin/GalleryCustomization';
import CtaCustomization from '../../components/admin/CtaCustomization';
import FooterCustomization from '../../components/admin/FooterCustomization';
import apiClient from '../../api/client'; 

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const TABS = [
  { key: 'hero', label: 'Hero', icon: ImageIcon },
  { key: 'services', label: 'Services', icon: List },
  { key: 'about', label: 'About Us', icon: User },
  { key: 'our_services', label: 'Our Services', icon: List },
  { key: 'how_we_work', label: 'How We Work', icon: Settings },
  { key: 'our_projects', label: 'Projects', icon: FileText },
  { key: 'panoramas', label: 'Panoramas', icon: ImageIcon },
  { key: 'team', label: 'Team', icon: User },
  { key: 'testimonials', label: 'Testimonials', icon: User },
  { key: 'video_banner', label: 'Video Banner', icon: ImageIcon },
  { key: 'blog_section', label: 'Blog Section', icon: FileText },
  { key: 'gallery', label: 'Gallery', icon: ImageIcon },
  { key: 'cta', label: 'Call to Action', icon: Send }
];

const HomeCustomization = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'hero');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (tabParam && (TABS.some(t => t.key === tabParam) || tabParam === 'footer')) {
      setActiveTab(tabParam);
    } else if (!tabParam) {
      setActiveTab('hero');
    }
  }, [tabParam]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Hero Section State
  const [heroData, setHeroData] = useState({
    slide1: {
      titleLine1: 'End-To-End', titleLine2: 'Office Interiors',
      subtitle: 'We specialize in transforming visions into reality.',
      buttonText: 'BOOK A FREE CONSULTATION', badgeText: 'Fast and Reliable',
      glassCardNumber: '250+', glassCardText1: 'My Design of art',
      glassCardText2: 'There Is No One Who Loves Pain Itself',
      backgroundImage: '', frontImage: ''
    },
    slide2: {
      badgeText: 'FAST AND RELIABLE', title: 'Find Your [Inspired]\n[Interior] Design',
      description: 'Transform your vision into reality with our innovative designs...',
      watermarkText: 'Interior', backgroundImage: ''
    },
    slide3: {
      titleLine1: 'End-To-End', titleLine2: 'Office Interiors',
      subtitle: 'For Every Test & Budget', description: "Simply dummy text...",
      buttonText: 'Book A Free Consultation', backgroundImage: ''
    }
  });

  // 2. Services State
  const [servicesData, setServicesData] = useState({
    badgeText: 'WHO WE ARE',
    title: 'Experience [The Art Of Interior] Design',
    description: 'We offer professional design services.',
    services: [
      { title: 'Architectural\nDesign', description: 'Brief description here' },
      { title: 'Interior Design\n& Planning', description: 'Brief description here' },
      { title: 'Consulting\nServices', description: 'Brief description here' },
      { title: 'Project\nManagement', description: 'Brief description here' }
    ]
  });

  // 3. About Section State
  const [aboutData, setAboutData] = useState({
    badgeText: 'STARTED IN 1991',
    title: 'Where Spaces Inspire, And [Design Comes Alive]',
    description: 'Dedicated to bringing your vision to life.',
    buttonText: 'More About Us',
    image: '',
    highlights: [
      'Latest Technologies',
      'High-Quality Designs',
      '10 Years Warranty',
      'Residential Design'
    ]
  });

  // 4. Our Services State
  const [ourServicesData, setOurServicesData] = useState({
    badgeText: 'OUR SERVICES',
    title: 'Explore Our [Comprehensive Interior Design] Services',
    description: 'We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.',
    services: [
      { id: '01', title: 'Residential Interior Design', link: '/services/residential-interior-design' },
      { id: '02', title: 'Outdoor & Landscape Design', link: '/services/outdoor-and-landscape-design' },
      { id: '03', title: 'Interior Design Consultation', link: '/services/interior-design-consultation' },
      { id: '04', title: 'Commercial Interior Design', link: '/services/commercial-interior-design' },
      { id: '05', title: 'Renovation And Remodeling', link: '/services/renovation-and-remodeling' },
      { id: '06', title: 'Interior 2D/3D Layouts', link: '/services/interior-2d-3d-layouts' }
    ],
    stats: [
      { value: '26+', title: 'YEARS EXPERIENCE', description: 'Improving homes with expert craftsmanship for years' },
      { value: '100', title: 'PROJECTS DONE', description: 'Over 250 successful projects delivered with quality and care' },
      { value: '100', title: 'SATISFIED CUSTOMER', description: 'Our team of 30 experts ensures top-quality results' },
      { value: '4+', title: 'LOCATION', description: 'All of our clients are satisfied with our work and service' }
    ],
    image: '',
    bottomImage: ''
  });

  // 5. How We Work State
  const [howWeWorkData, setHowWeWorkData] = useState({
    badgeText: 'HOW WE WORK',
    title: 'Description [Architecture Process] For Exceptional Results.',
    description: 'Our process is alive – adapting, refining, and growing with your vision. Always. Like artists with a blank canvas, we transform rooms into living works of art.',
    steps: [
      { id: '01', title: 'Initial Consultation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' },
      { id: '02', title: 'Design & Planning', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' },
      { id: '03', title: 'Implementation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' },
      { id: '04', title: 'Project Handover', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' }
    ],
    bottomText: "We've Been Working Hard To Impress You.",
    bottomLinkText: "Start Your's Today",
    bottomLinkUrl: '#'
  });

  // 6. Our Projects State
  const [ourProjectsData, setOurProjectsData] = useState({
    badgeText: 'OUR PROJECT',
    title: 'Creative [Projects That Define] Our Style',
    description: 'Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces functional and stylish commercial interiors.',
    projects: [
      { id: 1, category: 'LANDSCAPE', title: 'Art Deco Revival', description: 'Improving homes with expert craftsmanship for years', image: '' },
      { id: 2, category: 'RESIDENTIAL', title: 'Modern Minimalist', description: 'Improving homes with expert craftsmanship for years', image: '' },
      { id: 3, category: 'SINGLE HOME', title: 'Urban Oasis', description: 'Improving homes with expert craftsmanship for years', image: '' },
      { id: 4, category: 'OFFICE AREA', title: 'Corporate Elegance', description: 'Improving homes with expert craftsmanship for years', image: '' },
      { id: 5, category: 'COMMERCIAL', title: 'Retail Experience', description: 'Improving homes with expert craftsmanship for years', image: '' }
    ],
    bottomImage: ''
  });

  // 7. Panoramas State
  const [panoramasData, setPanoramasData] = useState({
    badgeText: '360-DEGREE PANORAMAS',
    title: 'Create An Even [Greater \\n Experience]',
    image: ''
  });

  // 8. Team State
  const [teamData, setTeamData] = useState({
    badgeText: 'AMAZING DESIGN TEAM',
    title: 'Meet The [Experts Our \\n Interior] Designers',
    description: 'Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces functional and stylish commercial interiors',
    image: '',
    members: [
      { id: '01', name: 'Mark Jackson', role: 'Co-Founder & CEO' },
      { id: '02', name: 'Valeria Novikova', role: 'Lighting Specialist' },
      { id: '03', name: 'Alex Podzemsky', role: 'Graphics Designer' },
      { id: '04', name: 'Helen Reeves', role: 'Material Consultant' },
      { id: '05', name: 'Jake Nicholson', role: '3D Visualisation' }
    ]
  });

  // 9. Testimonials State
  const [testimonialsData, setTestimonialsData] = useState({
    badgeText: 'OUR CLIENTS SAY',
    title: "Here's What [Warm Words] \\n [Our Clients] Say",
    description: 'Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces functional and stylish commercial interiors',
    image: '',
    ratingValue: '4.80',
    reviewCount: '2,688 Reviews',
    conceptText: "From Concept To Reality, The Team Turned My Vision Into A Stunning, Livable Space. I Couldn't Be Happier With This!",
    mainQuote: '"I absolutely love my the new modern living room! The clean lines, a neutral tones, and minimalist interior create such a calming & stylish atmosphere. Highly recommend their modern interior design services!"',
    authorImage: '',
    authorName: 'Morgan Dufresne',
    authorRole: 'Homeowner',
    bottomText: 'Our Website [75000+] VIP Customer',
    logos: ['', '', '', '', ''],
    items: [
      {
        ratingValue: '4.80',
        reviewCount: '2,688 Reviews',
        conceptText: "From Concept To Reality, The Team Turned My Vision Into A Stunning, Livable Space. I Couldn't Be Happier With This!",
        mainQuote: 'I absolutely love my new modern living room! The clean lines, neutral tones, and minimalist interior create such a calming & stylish atmosphere. Highly recommend their modern interior design services!',
        authorName: 'Morgan Dufresne',
        authorRole: 'Homeowner',
        image: '',
        authorImage: ''
      },
      {
        ratingValue: '4.90',
        reviewCount: '1,420 Reviews',
        conceptText: 'Design. Build. Deliver. Everything our office needed—handled end to end.',
        mainQuote: 'It is a pleasure to work with subhAAkritee. Together we created our office interior decoration. The interior designing, planning and decoration is just GREAT! All members are cooperative.',
        authorName: 'Tanmoy',
        authorRole: 'Company owner',
        image: '',
        authorImage: ''
      },
      {
        ratingValue: '4.95',
        reviewCount: '850 Reviews',
        conceptText: 'From dream homes to dynamic business spaces, they create architecture that reflects your vision.',
        mainQuote: 'They delivered outstanding architectural planning. The space layout and structural designs are perfect. Exceeded our expectations at every level of the project.',
        authorName: 'Rajesh Kumar',
        authorRole: 'Property Developer',
        image: '',
        authorImage: ''
      }
    ]
  });

  // 10. Video Banner State
  const [videoBannerData, setVideoBannerData] = useState({
    videoId: 'https://youtu.be/62bIsvRcPv0?si=Rw_dW3mB-EGrxooz',
    image: '',
    title: 'UNLOCK YOUR DREAM \\n HOME TODAY!',
    description: 'We encourage clients to actively participate in discussions, share their ideas, preferences, and feedback.'
  });

  // 11. Blog Section State
  const [blogSectionData, setBlogSectionData] = useState({
    badgeText: 'STRAIGHT FROM THE NEWSROOM',
    title: 'Take A Look At [Our Latest \\n Blog] & Articles.',
    posts: [
      { id: 1, author: 'Admin', title: 'Functional Design Trends That Blend Style And Comfort', excerpt: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: '' },
      { id: 2, author: 'Admin', title: 'Functional Design Trends That Blend Style And Comfort', excerpt: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: '' },
      { id: 3, author: 'Admin', title: 'Functional Design Trends That Blend Style And Comfort', excerpt: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: '' }
    ]
  });

  // 12. Gallery State
  const [galleryData, setGalleryData] = useState({
    bgText: 'gallery',
    images: ['', '', '', '', '', '']
  });

  // 13. CTA State
  const [ctaData, setCtaData] = useState({
    badgeText: 'GET IN TOUCH',
    title: "Have A Project In [Mind? Let's Make] It Happen",
    buttonText: 'BOOK A FREE CONSULTATION'
  });

  // 14. Footer State
  const [footerData, setFooterData] = useState({
    description: "We transform your vision into beautifully crafted spaces.",
    address: "Office: AG 40 , Sector II, Salt Lake City,\nKolkata: 700091",
    phone: "+91 9831-637-409",
    phone2: "",
    email: "Subhaakritee@Hotmail.Com",
    email2: "",
    instagram: "#",
    twitter: "#",
    facebook: "#",
    linkedin: "#",
    copyrightText: "Copyright Subhaakritee - All Rights Reserved.",
    linksTitle1: "Support",
    linksTitle2: "Company",
    links1: [
      { label: "Our Project", url: "/projects" },
      { label: "Partners", url: "/partners" },
      { label: "Partners Program", url: "/partners-program" },
      { label: "Affiliate Program", url: "/affiliate-program" },
      { label: "Terms & Conditions", url: "/terms" },
      { label: "Support Center", url: "/support" }
    ],
    links2: [
      { label: "About Us", url: "/about" },
      { label: "Services", url: "/services" },
      { label: "Careers", url: "/careers" },
      { label: "Our Team", url: "/team" },
      { label: "Blog", url: "/blog" },
      { label: "Contact Us", url: "/contact" }
    ]
  });

  // Previews
  const [previewBack, setPreviewBack] = useState('');
  const [previewFront, setPreviewFront] = useState('');
  const [previewAbout, setPreviewAbout] = useState('');
  const [previewOurServicesMain, setPreviewOurServicesMain] = useState('');
  const [previewOurServicesBottom, setPreviewOurServicesBottom] = useState('');
  const [previewOurProjectsBottom, setPreviewOurProjectsBottom] = useState('');
  const [previewOurProjectsList, setPreviewOurProjectsList] = useState(['', '', '', '', '']);
  const [previewPanoramasView, setPreviewPanoramasView] = useState('');
  const [previewTeamImage, setPreviewTeamImage] = useState('');
  const [previewTestimonialsMain, setPreviewTestimonialsMain] = useState(['', '', '']);
  const [previewTestimonialsAuthor, setPreviewTestimonialsAuthor] = useState(['', '', '']);
  const [previewTestimonialsLogos, setPreviewTestimonialsLogos] = useState(['', '', '', '', '']);
  const [previewVideoBannerCover, setPreviewVideoBannerCover] = useState('');
  const [previewBlogPosts, setPreviewBlogPosts] = useState(['', '', '']);
  const [previewGalleryImages, setPreviewGalleryImages] = useState(['', '', '', '', '', '']);

  // Refs
  const backImageRef = useRef(null);
  const frontImageRef = useRef(null);
  const aboutImageRef = useRef(null);
  const ourServicesMainRef = useRef(null);
  const ourServicesBottomRef = useRef(null);
  const ourProjectsBottomRef = useRef(null);
  const projectImageRefs = useRef([]);
  const panoramasViewRef = useRef(null);
  const teamImageRef = useRef(null);
  const testimonialsMainRef = useRef(null);
  const testimonialsAuthorRef = useRef(null);
  const testimonialsLogoRefs = useRef([]);
  const videoBannerRef = useRef(null);
  const blogImageRefs = useRef([]);
  const galleryImageRefs = useRef([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      
      const [
        heroRes, 
        servicesRes, 
        aboutRes,
        ourServicesRes,
        howWeWorkRes,
        ourProjectsRes,
        panoramasRes,
        teamRes,
        testimonialsRes,
        videoBannerRes,
        blogSectionRes,
        galleryRes,
        ctaRes,
        footerRes,
        pagesRes
      ] = await Promise.allSettled([
        apiClient.get('/cms/section/homepage_hero'),
        apiClient.get('/cms/section/homepage_services'),
        apiClient.get('/cms/section/homepage_about'),
        apiClient.get('/cms/section/homepage_our_services'),
        apiClient.get('/cms/section/homepage_how_we_work'),
        apiClient.get('/cms/section/homepage_our_projects'),
        apiClient.get('/cms/section/homepage_panoramas'),
        apiClient.get('/cms/section/homepage_team'),
        apiClient.get('/cms/section/homepage_testimonials'),
        apiClient.get('/cms/section/homepage_video_banner'),
        apiClient.get('/cms/section/homepage_blog_section'),
        apiClient.get('/cms/section/homepage_gallery'),
        apiClient.get('/cms/section/homepage_cta'),
        apiClient.get('/cms/section/homepage_footer'),
        apiClient.get('/admin/pages')
      ]);

      // Extract service pages for default services list
      let dbServicePages = [];
      if (pagesRes.status === 'fulfilled' && pagesRes.value.data?.data) {
        const pagesList = pagesRes.value.data.data || [];
        dbServicePages = pagesList
          .filter(page => {
            const currentSlug = (page.slug || '').toLowerCase().trim();
            const fullPath = (page.fullPath || '').toLowerCase().trim();
            return (
              currentSlug === 'services' || 
              currentSlug === 'service' || 
              fullPath.startsWith('/services') || 
              page.template === 'service-page'
            );
          })
          .map((page, index) => {
            const nextId = index + 1;
            const formattedId = nextId < 10 ? `0${nextId}` : `${nextId}`;
            return {
              id: formattedId,
              title: page.title,
              link: page.fullPath
            };
          });
      }

      // 1. Hero
      if (heroRes.status === 'fulfilled' && heroRes.value.data?.data?.content) {
        const content = heroRes.value.data.data.content;
        if (Object.keys(content).length > 0) {
          setHeroData(content);
        }
      }

      // 2. Services
      if (servicesRes.status === 'fulfilled' && servicesRes.value.data?.data?.content) {
        const content = servicesRes.value.data.data.content;
        if (Object.keys(content).length > 0) setServicesData(content);
      }

      // 3. About
      if (aboutRes.status === 'fulfilled' && aboutRes.value.data?.data?.content) {
        const content = aboutRes.value.data.data.content;
        if (Object.keys(content).length > 0) {
          setAboutData(content);
          if (content.image) setPreviewAbout(getAssetUrl(content.image));
        }
      }

      // 4. Our Services
      if (ourServicesRes.status === 'fulfilled' && ourServicesRes.value.data?.data?.content) {
        const content = ourServicesRes.value.data.data.content;
        if (Object.keys(content).length > 0) {
          const finalServices = (content.services && content.services.length > 0)
            ? content.services
            : dbServicePages;
          setOurServicesData({
            ...content,
            services: finalServices
          });
          if (content.image) setPreviewOurServicesMain(getAssetUrl(content.image));
          if (content.bottomImage) setPreviewOurServicesBottom(getAssetUrl(content.bottomImage));
        } else {
          setOurServicesData(prev => ({
            ...prev,
            services: dbServicePages
          }));
        }
      } else {
        setOurServicesData(prev => ({
          ...prev,
          services: dbServicePages
        }));
      }

      // 5. How We Work
      if (howWeWorkRes.status === 'fulfilled' && howWeWorkRes.value.data?.data?.content) {
        const content = howWeWorkRes.value.data.data.content;
        if (Object.keys(content).length > 0) setHowWeWorkData(content);
      }

      // 6. Projects
      if (ourProjectsRes.status === 'fulfilled' && ourProjectsRes.value.data?.data?.content) {
        const content = ourProjectsRes.value.data.data.content;
        if (Object.keys(content).length > 0) {
          setOurProjectsData(content);
          if (content.bottomImage) setPreviewOurProjectsBottom(getAssetUrl(content.bottomImage));
          if (content.projects) {
            setPreviewOurProjectsList(content.projects.map(p => p.image ? getAssetUrl(p.image) : ''));
          }
        }
      }

      // 7. Panoramas
      if (panoramasRes.status === 'fulfilled' && panoramasRes.value.data?.data?.content) {
        const content = panoramasRes.value.data.data.content;
        if (Object.keys(content).length > 0) {
          setPanoramasData(content);
          if (content.image) setPreviewPanoramasView(getAssetUrl(content.image));
        }
      }

      // 8. Team
      if (teamRes.status === 'fulfilled' && teamRes.value.data?.data?.content) {
        const content = teamRes.value.data.data.content;
        if (Object.keys(content).length > 0) {
          setTeamData(content);
          if (content.image) setPreviewTeamImage(getAssetUrl(content.image));
        }
      }

      // 9. Testimonials
      if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value.data?.data?.content) {
        const content = testimonialsRes.value.data.data.content;
        if (Object.keys(content).length > 0) {
          const items = (Array.isArray(content.items) && content.items.length >= 3)
            ? content.items
            : [
                {
                  ratingValue: content.ratingValue || '4.80',
                  reviewCount: content.reviewCount || '2,688 Reviews',
                  conceptText: content.conceptText || "From Concept To Reality, The Team Turned My Vision Into A Stunning, Livable Space.",
                  mainQuote: content.mainQuote || 'I absolutely love my new modern living room!',
                  authorName: content.authorName || 'Morgan Dufresne',
                  authorRole: content.authorRole || 'Homeowner',
                  image: content.image || '',
                  authorImage: content.authorImage || ''
                },
                {
                  ratingValue: '4.90',
                  reviewCount: '1,420 Reviews',
                  conceptText: 'Design. Build. Deliver. Everything our office needed—handled end to end.',
                  mainQuote: 'It is a pleasure to work with subhAAkritee. Together we created our office interior decoration. The interior designing, planning and decoration is just GREAT! All members are cooperative.',
                  authorName: 'Tanmoy',
                  authorRole: 'Company owner',
                  image: '',
                  authorImage: ''
                },
                {
                  ratingValue: '4.95',
                  reviewCount: '850 Reviews',
                  conceptText: 'From dream homes to dynamic business spaces, they create architecture that reflects your vision.',
                  mainQuote: 'They delivered outstanding architectural planning. The space layout and structural designs are perfect. Exceeded our expectations at every level of the project.',
                  authorName: 'Rajesh Kumar',
                  authorRole: 'Property Developer',
                  image: '',
                  authorImage: ''
                }
              ];

          setTestimonialsData({ ...content, items });
          setPreviewTestimonialsMain([
            items[0]?.image ? getAssetUrl(items[0].image) : (content.image ? getAssetUrl(content.image) : ''),
            items[1]?.image ? getAssetUrl(items[1].image) : '',
            items[2]?.image ? getAssetUrl(items[2].image) : ''
          ]);
          setPreviewTestimonialsAuthor([
            items[0]?.authorImage ? getAssetUrl(items[0].authorImage) : (content.authorImage ? getAssetUrl(content.authorImage) : ''),
            items[1]?.authorImage ? getAssetUrl(items[1].authorImage) : '',
            items[2]?.authorImage ? getAssetUrl(items[2].authorImage) : ''
          ]);
          if (content.logos) {
            setPreviewTestimonialsLogos(content.logos.map(img => img ? getAssetUrl(img) : ''));
          }
        }
      }

      // 10. Video Banner
      if (videoBannerRes.status === 'fulfilled' && videoBannerRes.value.data?.data?.content) {
        const content = videoBannerRes.value.data.data.content;
        if (Object.keys(content).length > 0) {
          setVideoBannerData(content);
          if (content.image) setPreviewVideoBannerCover(getAssetUrl(content.image));
        }
      }

      // 11. Blog
      if (blogSectionRes.status === 'fulfilled' && blogSectionRes.value.data?.data?.content) {
        const content = blogSectionRes.value.data.data.content;
        if (Object.keys(content).length > 0) {
          setBlogSectionData(content);
          if (content.posts) {
            setPreviewBlogPosts(content.posts.map(p => p.image ? getAssetUrl(p.image) : ''));
          }
        }
      }

      // 12. Gallery
      if (galleryRes.status === 'fulfilled' && galleryRes.value.data?.data?.content) {
        const content = galleryRes.value.data.data.content;
        if (Object.keys(content).length > 0) {
          setGalleryData(content);
          if (content.images) {
            setPreviewGalleryImages(content.images.map(img => img ? getAssetUrl(img) : ''));
          }
        }
      }

      // 13. CTA
      if (ctaRes.status === 'fulfilled' && ctaRes.value.data?.data?.content) {
        const content = ctaRes.value.data.data.content;
        if (Object.keys(content).length > 0) setCtaData(content);
      }

      // 14. Footer
      if (footerRes.status === 'fulfilled' && footerRes.value.data?.data?.content) {
        const content = footerRes.value.data.data.content;
        if (Object.keys(content).length > 0) setFooterData(content);
      }
    } catch (error) {
      console.error('Failed to fetch homepage data:', error);
      setErrorMsg('Failed to load initial data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  // Base Handlers
  const handleHeroInputChange = (slideKey, field, value) => {
    setHeroData(prev => ({
      ...prev,
      [slideKey]: {
        ...prev[slideKey],
        [field]: value
      }
    }));
  };

  const handleServicesInputChange = (e) => {
    const { name, value } = e.target;
    setServicesData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceItemChange = (index, field, value) => {
    setServicesData(prev => {
      const updatedServices = [...prev.services];
      updatedServices[index] = { ...updatedServices[index], [field]: value };
      return { ...prev, services: updatedServices };
    });
  };

  const handleAboutInputChange = (e) => {
    const { name, value } = e.target;
    setAboutData(prev => ({ ...prev, [name]: value }));
  };

  const handleHighlightChange = (index, value) => {
    setAboutData(prev => {
      const updatedHighlights = [...prev.highlights];
      updatedHighlights[index] = value;
      return { ...prev, highlights: updatedHighlights };
    });
  };

  // OurServices
  const handleOurServicesInputChange = (e) => {
    const { name, value } = e.target;
    setOurServicesData(prev => ({ ...prev, [name]: value }));
  };

  const handleOurServicesItemChange = (index, field, value) => {
    setOurServicesData(prev => {
      const updatedServices = [...prev.services];
      updatedServices[index] = { ...updatedServices[index], [field]: value };
      return { ...prev, services: updatedServices };
    });
  };

  const handleOurServicesStatChange = (index, field, value) => {
    setOurServicesData(prev => {
      const updatedStats = [...prev.stats];
      updatedStats[index] = { ...updatedStats[index], [field]: value };
      return { ...prev, stats: updatedStats };
    });
  };

  const handleOurServicesAddService = () => {
    setOurServicesData(prev => {
      const updatedServices = [...(prev.services || [])];
      const nextId = updatedServices.length + 1;
      const formattedId = nextId < 10 ? `0${nextId}` : `${nextId}`;
      updatedServices.push({ id: formattedId, title: 'New Service', link: '' });
      return { ...prev, services: updatedServices };
    });
  };

  const handleOurServicesDeleteService = (index) => {
    setOurServicesData(prev => {
      const updatedServices = (prev.services || []).filter((_, i) => i !== index);
      const reindexedServices = updatedServices.map((service, idx) => {
        const nextId = idx + 1;
        const formattedId = nextId < 10 ? `0${nextId}` : `${nextId}`;
        return { ...service, id: formattedId };
      });
      return { ...prev, services: reindexedServices };
    });
  };

  // HowWeWork
  const handleHowWeWorkInputChange = (e) => {
    const { name, value } = e.target;
    setHowWeWorkData(prev => ({ ...prev, [name]: value }));
  };

  const handleHowWeWorkStepChange = (index, field, value) => {
    setHowWeWorkData(prev => {
      const updatedSteps = [...prev.steps];
      updatedSteps[index] = { ...updatedSteps[index], [field]: value };
      return { ...prev, steps: updatedSteps };
    });
  };

  // OurProjects
  const handleOurProjectsInputChange = (e) => {
    const { name, value } = e.target;
    setOurProjectsData(prev => ({ ...prev, [name]: value }));
  };

  const handleOurProjectsItemChange = (index, field, value) => {
    setOurProjectsData(prev => {
      const updatedProjects = [...prev.projects];
      updatedProjects[index] = { ...updatedProjects[index], [field]: value };
      return { ...prev, projects: updatedProjects };
    });
  };

  // Panoramas
  const handlePanoramasInputChange = (e) => {
    const { name, value } = e.target;
    setPanoramasData(prev => ({ ...prev, [name]: value }));
  };

  // Team
  const handleTeamInputChange = (e) => {
    const { name, value } = e.target;
    setTeamData(prev => ({ ...prev, [name]: value }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    setTeamData(prev => {
      const updated = [...prev.members];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, members: updated };
    });
  };

  // Testimonials
  const handleTestimonialsInputChange = (e) => {
    const { name, value } = e.target;
    setTestimonialsData(prev => ({ ...prev, [name]: value }));
  };

  const handleTestimonialsItemChange = (tabIndex, fieldName, value) => {
    setTestimonialsData(prev => {
      const items = Array.isArray(prev.items) && prev.items.length >= 3
        ? [...prev.items]
        : [
            {
              ratingValue: prev.ratingValue || '4.80',
              reviewCount: prev.reviewCount || '2,688 Reviews',
              conceptText: prev.conceptText || "From Concept To Reality, The Team Turned My Vision Into A Stunning, Livable Space.",
              mainQuote: prev.mainQuote || 'I absolutely love my new modern living room!',
              authorName: prev.authorName || 'Morgan Dufresne',
              authorRole: prev.authorRole || 'Homeowner',
              image: prev.image || '',
              authorImage: prev.authorImage || ''
            },
            {
              ratingValue: '4.90',
              reviewCount: '1,420 Reviews',
              conceptText: 'Design. Build. Deliver. Everything our office needed—handled end to end.',
              mainQuote: 'It is a pleasure to work with subhAAkritee. Together we created our office interior decoration.',
              authorName: 'Tanmoy',
              authorRole: 'Company owner',
              image: '',
              authorImage: ''
            },
            {
              ratingValue: '4.95',
              reviewCount: '850 Reviews',
              conceptText: 'From dream homes to dynamic business spaces, they create architecture that reflects your vision.',
              mainQuote: 'They delivered outstanding architectural planning. The space layout and structural designs are perfect.',
              authorName: 'Rajesh Kumar',
              authorRole: 'Property Developer',
              image: '',
              authorImage: ''
            }
          ];

      items[tabIndex] = {
        ...items[tabIndex],
        [fieldName]: value
      };

      const updated = {
        ...prev,
        items
      };

      if (tabIndex === 0) {
        updated[fieldName] = value;
      }

      return updated;
    });
  };

  const handleTestimonialsLogoUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewTestimonialsLogos(prev => {
        const newList = [...prev];
        newList[index] = event.target.result;
        return newList;
      });
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('image', file);

    try {
      setErrorMsg('');
      const res = await apiClient.post('/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { data } = res;
      if (data.success && data.data.url) {
        const uploadedUrl = data.data.url;
        setTestimonialsData(prev => {
          const newLogos = [...prev.logos];
          newLogos[index] = uploadedUrl;
          return { ...prev, logos: newLogos };
        });
      }
    } catch (error) {
      console.error(`Failed to upload logo ${index}:`, error);
      setErrorMsg(`Upload Failed: ${error.response?.data?.message || 'File must be an image (Max 5MB)'}`);
      
      setPreviewTestimonialsLogos(prev => {
        const newList = [...prev];
        newList[index] = testimonialsData.logos[index] ? getAssetUrl(testimonialsData.logos[index]) : '';
        return newList;
      });
    } finally {
      e.target.value = '';
    }
  };

  // Video Banner
  const handleVideoBannerInputChange = (e) => {
    const { name, value } = e.target;
    setVideoBannerData(prev => ({ ...prev, [name]: value }));
  };

  // Blog Section
  const handleBlogSectionInputChange = (e) => {
    const { name, value } = e.target;
    setBlogSectionData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlogSectionPostChange = (index, field, value) => {
    setBlogSectionData(prev => {
      const updatedPosts = [...prev.posts];
      updatedPosts[index] = { ...updatedPosts[index], [field]: value };
      return { ...prev, posts: updatedPosts };
    });
  };

  // Gallery
  const handleGalleryInputChange = (e) => {
    const { name, value } = e.target;
    setGalleryData(prev => ({ ...prev, [name]: value }));
  };

  // CTA
  const handleCtaInputChange = (e) => {
    const { name, value } = e.target;
    setCtaData(prev => ({ ...prev, [name]: value }));
  };
  const handleImageUpload = async (e, type, tabIdx = 0) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (type === 'slide1_bg') setHeroData(p => ({ ...p, slide1: { ...p.slide1, backgroundImage: event.target.result } }));
      else if (type === 'slide1_front') setHeroData(p => ({ ...p, slide1: { ...p.slide1, frontImage: event.target.result } }));
      else if (type === 'slide2_bg') setHeroData(p => ({ ...p, slide2: { ...p.slide2, backgroundImage: event.target.result } }));
      else if (type === 'slide3_bg') setHeroData(p => ({ ...p, slide3: { ...p.slide3, backgroundImage: event.target.result } }));
      else if (type === 'about') setPreviewAbout(event.target.result);
      else if (type === 'serviceMain') setPreviewOurServicesMain(event.target.result);
      else if (type === 'serviceBottom') setPreviewOurServicesBottom(event.target.result);
      else if (type === 'projectsBottom') setPreviewOurProjectsBottom(event.target.result);
      else if (type === 'panoramaView') setPreviewPanoramasView(event.target.result);
      else if (type === 'team') setPreviewTeamImage(event.target.result);
      else if (type === 'testimonialsMain') {
        setPreviewTestimonialsMain(prev => {
          const list = Array.isArray(prev) ? [...prev] : ['', '', ''];
          list[tabIdx] = event.target.result;
          return list;
        });
      }
      else if (type === 'testimonialsAuthor') {
        setPreviewTestimonialsAuthor(prev => {
          const list = Array.isArray(prev) ? [...prev] : ['', '', ''];
          list[tabIdx] = event.target.result;
          return list;
        });
      }
      else if (type === 'videoBanner') setPreviewVideoBannerCover(event.target.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('image', file); 

    try {
      setErrorMsg('');
      const res = await apiClient.post('/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const { data } = res;
      if (data.success && data.data.url) {
        const uploadedUrl = data.data.url;
        if (type === 'slide1_bg') setHeroData(p => ({ ...p, slide1: { ...p.slide1, backgroundImage: uploadedUrl } }));
        else if (type === 'slide1_front') setHeroData(p => ({ ...p, slide1: { ...p.slide1, frontImage: uploadedUrl } }));
        else if (type === 'slide2_bg') setHeroData(p => ({ ...p, slide2: { ...p.slide2, backgroundImage: uploadedUrl } }));
        else if (type === 'slide3_bg') setHeroData(p => ({ ...p, slide3: { ...p.slide3, backgroundImage: uploadedUrl } }));
        else if (type === 'about') setAboutData(prev => ({ ...prev, image: uploadedUrl }));
        else if (type === 'serviceMain') setOurServicesData(prev => ({ ...prev, image: uploadedUrl }));
        else if (type === 'serviceBottom') setOurServicesData(prev => ({ ...prev, bottomImage: uploadedUrl }));
        else if (type === 'projectsBottom') setOurProjectsData(prev => ({ ...prev, bottomImage: uploadedUrl }));
        else if (type === 'panoramaView') setPanoramasData(prev => ({ ...prev, image: uploadedUrl }));
        else if (type === 'team') setTeamData(prev => ({ ...prev, image: uploadedUrl }));
        else if (type === 'testimonialsMain') {
          handleTestimonialsItemChange(tabIdx, 'image', uploadedUrl);
        }
        else if (type === 'testimonialsAuthor') {
          handleTestimonialsItemChange(tabIdx, 'authorImage', uploadedUrl);
        }
        else if (type === 'videoBanner') setVideoBannerData(prev => ({ ...prev, image: uploadedUrl }));
      }
    } catch (error) {
      console.error(`Failed to upload ${type} image:`, error);
      const errorDetail = error.response?.data?.message || 'File must be an image (Max 5MB)';
      setErrorMsg(`Upload Failed: ${errorDetail}`); 
    } finally {
      e.target.value = ''; 
    }
  };

  const handleProjectImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewOurProjectsList(prev => {
        const newList = [...prev];
        newList[index] = event.target.result;
        return newList;
      });
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('image', file);

    try {
      setErrorMsg('');
      const res = await apiClient.post('/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { data } = res;
      if (data.success && data.data.url) {
        const uploadedUrl = data.data.url;
        setOurProjectsData(prev => {
          const newProjects = [...prev.projects];
          newProjects[index] = { ...newProjects[index], image: uploadedUrl };
          return { ...prev, projects: newProjects };
        });
      }
    } catch (error) {
      console.error(`Failed to upload project ${index} image:`, error);
      const errorDetail = error.response?.data?.message || 'File must be an image (Max 5MB)';
      setErrorMsg(`Upload Failed: ${errorDetail}`);
      
      setPreviewOurProjectsList(prev => {
        const newList = [...prev];
        newList[index] = ourProjectsData.projects[index]?.image ? getAssetUrl(ourProjectsData.projects[index].image) : '';
        return newList;
      });
    } finally {
      e.target.value = '';
    }
  };

  const handleBlogPostImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewBlogPosts(prev => {
        const newList = [...prev];
        newList[index] = event.target.result;
        return newList;
      });
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('image', file);

    try {
      setErrorMsg('');
      const res = await apiClient.post('/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { data } = res;
      if (data.success && data.data.url) {
        const uploadedUrl = data.data.url;
        setBlogSectionData(prev => {
          const newPosts = [...prev.posts];
          newPosts[index] = { ...newPosts[index], image: uploadedUrl };
          return { ...prev, posts: newPosts };
        });
      }
    } catch (error) {
      console.error(`Failed to upload blog ${index} image:`, error);
      const errorDetail = error.response?.data?.message || 'File must be an image (Max 5MB)';
      setErrorMsg(`Upload Failed: ${errorDetail}`);
      
      setPreviewBlogPosts(prev => {
        const newList = [...prev];
        newList[index] = blogSectionData.posts[index]?.image ? getAssetUrl(blogSectionData.posts[index].image) : '';
        return newList;
      });
    } finally {
      e.target.value = '';
    }
  };

  const handleGalleryImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewGalleryImages(prev => {
        const newList = [...prev];
        newList[index] = event.target.result;
        return newList;
      });
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('image', file);

    try {
      setErrorMsg('');
      const res = await apiClient.post('/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { data } = res;
      if (data.success && data.data.url) {
        const uploadedUrl = data.data.url;
        setGalleryData(prev => {
          const newImages = [...prev.images];
          newImages[index] = uploadedUrl;
          return { ...prev, images: newImages };
        });
      }
    } catch (error) {
      console.error(`Failed to upload gallery ${index} image:`, error);
      const errorDetail = error.response?.data?.message || 'File must be an image (Max 5MB)';
      setErrorMsg(`Upload Failed: ${errorDetail}`);
      
      setPreviewGalleryImages(prev => {
        const newList = [...prev];
        newList[index] = galleryData.images[index] ? getAssetUrl(galleryData.images[index]) : '';
        return newList;
      });
    } finally {
      e.target.value = '';
    }
  };

  const handleTeamMemberImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setErrorMsg('');
      const res = await apiClient.post('/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { data } = res;
      if (data.success && data.data.url) {
        const uploadedUrl = data.data.url;
        setTeamData(prev => {
          const updated = [...prev.members];
          updated[index] = { ...updated[index], image: uploadedUrl };
          return { ...prev, members: updated };
        });
      }
    } catch (error) {
      console.error(`Failed to upload team member ${index} image:`, error);
      setErrorMsg('Upload Failed: File must be an image (Max 5MB)');
    } finally {
      e.target.value = '';
    }
  };

  
  const handleFooterInputChange = (e) => {
    const { name, value } = e.target;
    setFooterData(prev => ({ ...prev, [name]: value }));
  };

  const handleFooterLinkChange = (columnKey, index, field, value) => {
    setFooterData(prev => {
      const updatedLinks = [...prev[columnKey]];
      updatedLinks[index] = { ...updatedLinks[index], [field]: value };
      return { ...prev, [columnKey]: updatedLinks };
    });
  };

  const handleFooterAddLink = (columnKey) => {
    setFooterData(prev => {
      const updatedLinks = [...(prev[columnKey] || [])];
      updatedLinks.push({ label: 'New Link', url: '#' });
      return { ...prev, [columnKey]: updatedLinks };
    });
  };

  const handleFooterDeleteLink = (columnKey, index) => {
    setFooterData(prev => {
      const updatedLinks = prev[columnKey].filter((_, i) => i !== index);
      return { ...prev, [columnKey]: updatedLinks };
    });
  };

  const getVisibilityState = () => {
    switch (activeTab) {
      case 'hero': return heroData.isVisible !== false;
      case 'services': return servicesData.isVisible !== false;
      case 'about': return aboutData.isVisible !== false;
      case 'our_services': return ourServicesData.isVisible !== false;
      case 'how_we_work': return howWeWorkData.isVisible !== false;
      case 'our_projects': return ourProjectsData.isVisible !== false;
      case 'panoramas': return panoramasData.isVisible !== false;
      case 'team': return teamData.isVisible !== false;
      case 'testimonials': return testimonialsData.isVisible !== false;
      case 'video_banner': return videoBannerData.isVisible !== false;
      case 'blog_section': return blogSectionData.isVisible !== false;
      case 'gallery': return galleryData.isVisible !== false;
      case 'cta': return ctaData.isVisible !== false;
      default: return true;
    }
  };

  const handleVisibilityToggle = (e) => {
    const isVisible = e.target.checked;
    switch (activeTab) {
      case 'hero': setHeroData(p => ({...p, isVisible})); break;
      case 'services': setServicesData(p => ({...p, isVisible})); break;
      case 'about': setAboutData(p => ({...p, isVisible})); break;
      case 'our_services': setOurServicesData(p => ({...p, isVisible})); break;
      case 'how_we_work': setHowWeWorkData(p => ({...p, isVisible})); break;
      case 'our_projects': setOurProjectsData(p => ({...p, isVisible})); break;
      case 'panoramas': setPanoramasData(p => ({...p, isVisible})); break;
      case 'team': setTeamData(p => ({...p, isVisible})); break;
      case 'testimonials': setTestimonialsData(p => ({...p, isVisible})); break;
      case 'video_banner': setVideoBannerData(p => ({...p, isVisible})); break;
      case 'blog_section': setBlogSectionData(p => ({...p, isVisible})); break;
      case 'gallery': setGalleryData(p => ({...p, isVisible})); break;
      case 'cta': setCtaData(p => ({...p, isVisible})); break;
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMsg('');
      
      let url = `/cms/section/homepage_${activeTab}`;
      let payload = null;

      if (activeTab === 'hero') payload = { content: heroData };
      else if (activeTab === 'services') payload = { content: servicesData };
      else if (activeTab === 'about') payload = { content: aboutData };
      else if (activeTab === 'our_services') payload = { content: ourServicesData };
      else if (activeTab === 'how_we_work') payload = { content: howWeWorkData };
      else if (activeTab === 'our_projects') payload = { content: ourProjectsData };
      else if (activeTab === 'panoramas') payload = { content: panoramasData };
      else if (activeTab === 'team') payload = { content: teamData };
      else if (activeTab === 'testimonials') payload = { content: testimonialsData };
      else if (activeTab === 'video_banner') payload = { content: videoBannerData };
      else if (activeTab === 'blog_section') payload = { content: blogSectionData };
      else if (activeTab === 'gallery') payload = { content: galleryData };
      else if (activeTab === 'cta') payload = { content: ctaData };
      else if (activeTab === 'footer') payload = { content: footerData };

      const res = await apiClient.put(url, payload);
      
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error(`Failed to save ${activeTab} settings:`, error);
      setErrorMsg(error.response?.data?.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900 dark:text-zinc-100" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 animation-fade-in text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {activeTab === 'footer' ? 'Footer Settings Customization' : 'Home Page Customization'}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm sm:text-base">
            {activeTab === 'footer'
              ? 'Manage the navigation links, contact info, and copyright settings for the website footer.'
              : 'Manage the content and images for your main landing page.'}
          </p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 px-6 py-2.5 rounded-xl font-medium tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg shadow-zinc-900/20 dark:shadow-none disabled:opacity-70 text-sm w-full sm:w-auto"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in-down transition-colors duration-300">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Changes saved successfully! The homepage has been updated.</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in-down transition-colors duration-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Component Selector Dropdown */}
      {activeTab !== 'footer' && (
        <div className="relative mb-6 z-40" ref={dropdownRef}>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Select Component to Edit</label>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full sm:max-w-md flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-4 py-3 rounded-xl shadow-sm hover:border-zinc-300 dark:hover:border-zinc-600 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10"
          >
            <div className="flex items-center gap-3">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg transition-colors">
                {(() => {
                  const ActiveIcon = TABS.find(t => t.key === activeTab)?.icon || ImageIcon;
                  return <ActiveIcon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />;
                })()}
              </div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 transition-colors">
                {TABS.find(t => t.key === activeTab)?.label || 'Select Component'}
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-zinc-400 dark:text-zinc-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-full sm:max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 transition-colors">
              <div className="p-2 grid gap-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setSearchParams(tab.key === 'hero' ? {} : { tab: tab.key });
                      setDropdownOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full text-left group ${
                      activeTab === tab.key 
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md' 
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                    }`}
                  >
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.key ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'}`} />
                    <span className="font-medium text-sm">{tab.label}</span>
                    {activeTab === tab.key && (
                      <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Section Visibility Master Toggle */}
      {activeTab !== 'footer' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 flex items-center justify-between mb-6 transition-colors duration-300">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Show on Homepage</h3>
          </div>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                checked={getVisibilityState()} 
                onChange={handleVisibilityToggle} 
                className="sr-only" 
              />
              <div className={`block w-12 h-7 rounded-full transition-colors duration-300 ${getVisibilityState() ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${getVisibilityState() ? 'transform translate-x-5' : ''}`}></div>
            </div>
          </label>
        </div>
      )}

      {/* Tab Contents */}
      {activeTab === 'hero' && (
        <HeroCustomization
          heroData={heroData}
          onChange={handleHeroInputChange}
          previewBack={previewBack}
          previewFront={previewFront}
          backImageRef={backImageRef}
          frontImageRef={frontImageRef}
          onImageUpload={handleImageUpload}
        />
      )}

      {activeTab === 'services' && (
        <ServicesCustomization
          servicesData={servicesData}
          onChange={handleServicesInputChange}
          onServiceItemChange={handleServiceItemChange}
        />
      )}

      {activeTab === 'about' && (
        <AboutCustomization
          aboutData={aboutData}
          onChange={handleAboutInputChange}
          onHighlightChange={handleHighlightChange}
          previewAbout={previewAbout}
          aboutImageRef={aboutImageRef}
          onImageUpload={handleImageUpload}
        />
      )}

      {activeTab === 'our_services' && (
        <OurServicesCustomization
          ourServicesData={ourServicesData}
          onChange={handleOurServicesInputChange}
          onServiceItemChange={handleOurServicesItemChange}
          onStatItemChange={handleOurServicesStatChange}
          onAddService={handleOurServicesAddService}
          onDeleteService={handleOurServicesDeleteService}
          previewMain={previewOurServicesMain}
          previewBottom={previewOurServicesBottom}
          mainImageRef={ourServicesMainRef}
          bottomImageRef={ourServicesBottomRef}
          onImageUpload={handleImageUpload}
        />
      )}

      {activeTab === 'how_we_work' && (
        <HowWeWorkCustomization
          howWeWorkData={howWeWorkData}
          onChange={handleHowWeWorkInputChange}
          onStepItemChange={handleHowWeWorkStepChange}
        />
      )}

      {activeTab === 'our_projects' && (
        <OurProjectsCustomization
          ourProjectsData={ourProjectsData}
          onChange={handleOurProjectsInputChange}
          onProjectItemChange={handleOurProjectsItemChange}
          onProjectImageUpload={handleProjectImageUpload}
          previewProjects={previewOurProjectsList}
          previewBottom={previewOurProjectsBottom}
          bottomImageRef={ourProjectsBottomRef}
          projectImageRefs={projectImageRefs}
          onImageUpload={handleImageUpload}
        />
      )}

      {activeTab === 'panoramas' && (
        <PanoramasCustomization
          panoramasData={panoramasData}
          onChange={handlePanoramasInputChange}
          previewImage={previewPanoramasView}
          imageRef={panoramasViewRef}
          onImageUpload={handleImageUpload}
        />
      )}

      {activeTab === 'team' && (
        <TeamCustomization
          teamData={teamData}
          onChange={handleTeamInputChange}
          onMemberChange={handleTeamMemberChange}
          onMemberImageUpload={handleTeamMemberImageUpload}
        />
      )}

      {activeTab === 'testimonials' && (
        <TestimonialsCustomization
          testimonialsData={testimonialsData}
          onChange={handleTestimonialsInputChange}
          onItemChange={handleTestimonialsItemChange}
          previewMain={previewTestimonialsMain}
          previewAuthor={previewTestimonialsAuthor}
          mainImageRef={testimonialsMainRef}
          authorImageRef={testimonialsAuthorRef}
          onImageUpload={handleImageUpload}
          onLogoUpload={handleTestimonialsLogoUpload}
          previewLogos={previewTestimonialsLogos}
          logoRefs={testimonialsLogoRefs}
        />
      )}

      {activeTab === 'video_banner' && (
        <VideoBannerCustomization
          videoBannerData={videoBannerData}
          onChange={handleVideoBannerInputChange}
          previewImage={previewVideoBannerCover}
          imageRef={videoBannerRef}
          onImageUpload={handleImageUpload}
        />
      )}

      {activeTab === 'blog_section' && (
        <BlogSectionCustomization
          blogSectionData={blogSectionData}
          onChange={handleBlogSectionInputChange}
          onPostChange={handleBlogSectionPostChange}
          onPostImageUpload={handleBlogPostImageUpload}
          previewPosts={previewBlogPosts}
          postImageRefs={blogImageRefs}
        />
      )}

      {activeTab === 'gallery' && (
        <GalleryCustomization
          galleryData={galleryData}
          onChange={handleGalleryInputChange}
          onGalleryImageUpload={handleGalleryImageUpload}
          previewImages={previewGalleryImages}
          imageRefs={galleryImageRefs}
        />
      )}

      {activeTab === 'cta' && (
        <CtaCustomization
          ctaData={ctaData}
          onChange={handleCtaInputChange}
        />
      )}

      {activeTab === 'footer' && (
        <FooterCustomization
          footerData={footerData}
          onChange={handleFooterInputChange}
          onLinkChange={handleFooterLinkChange}
          onAddLink={handleFooterAddLink}
          onDeleteLink={handleFooterDeleteLink}
        />
      )}

      <div className="flex justify-start mt-8 pt-4">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3 rounded-xl font-medium tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg shadow-zinc-900/20 disabled:opacity-70 text-sm w-full sm:w-auto"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default HomeCustomization;