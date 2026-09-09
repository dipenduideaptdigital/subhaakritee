import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { pagesApi } from '../../../api/pages';
import {
  Save,
  ArrowLeft,
  AlertCircle,
  Layout,
  Type,
  Plus,
  Trash2,
  Settings,
  ChevronDown
} from 'lucide-react';
import DynamicBlockEditor from '../../../components/admin/DynamicBlockEditor';
import PreviewManager from '../../../components/admin/PreviewManager';
import { Puck } from '@measured/puck';
import '@measured/puck/puck.css';
import { puckConfig } from '../../../config/puck.config';
import Can from '../../../components/shared/Can';

const PageEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!id;

  const isSitePagesMode = location.pathname.includes('/admin/site-pages');
  const isServicesMode = location.pathname.includes('/admin/services');
  const backPath = isServicesMode ? '/admin/services' : (isSitePagesMode ? '/admin/site-pages' : '/admin/pages');

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [isPuckMode, setIsPuckMode] = useState(false);

  useEffect(() => {
    if (isPuckMode) {
      document.body.classList.add('puck-mode');
    } else {
      document.body.classList.remove('puck-mode');
    }
    return () => {
      document.body.classList.remove('puck-mode');
    };
  }, [isPuckMode]);

  const AVAILABLE_BLOCKS = [
    { type: 'heroSectionTwo', label: 'Hero Section Two' },
    { type: 'aboutSectionTwo', label: 'About Section Two' },
    { type: 'servicesSectionTwo', label: 'Services Section Two' },
    { type: 'processSectionTwo', label: 'Process Section Two' },
    { type: 'projectSliderTwo', label: 'Project Slider Two' },
    { type: 'trustedPartners', label: 'Trusted Partners' },
    { type: 'statsSectionTwo', label: 'Stats Section Two' },
    { type: 'happySpaces', label: 'Happy Spaces' },
    { type: 'happyCustomers', label: 'Happy Customers' },
    { type: 'testimonialsTwo', label: 'Testimonials Two' },
    { type: 'ctaSectionTwo', label: 'CTA Section Two' },
    { type: 'richText', label: 'Rich Text Box' },
    { type: 'contactForm', label: 'Contact Form (Dynamic Engine)' },
    { type: 'serviceBanner', label: 'Service Banner' },
    { type: 'serviceDetails', label: 'Service Details Main Content' },
    { type: 'ctaSection', label: 'Call To Action (CTA) Section' },
    { type: 'contactBanner', label: 'Contact Us Banner' },
    { type: 'contactInfo', label: 'Contact Info & Form' },
    { type: 'blogBanner', label: 'Blog Banner' }
  ];

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    status: 'DRAFT',
    template: isServicesMode && !isEditMode ? 'service-page' : 'default', 
    content: { blocks: [] },
    metaTitle: '', metaDescription: '', metaKeywords: '',
    includeInSitemap: true, noIndex: false, noFollow: false,
    canonicalUrl: '', ogTitle: '', ogDescription: '', ogImageId: null
  });

  useEffect(() => {
    // Scroll the admin layout container to top when entering this page
    const adminScrollContainer = document.querySelector('main > div.overflow-auto');
    if (adminScrollContainer) {
      adminScrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (isEditMode) {
      fetchPage();
    } else if (isServicesMode && !isEditMode) {
      setFormData(prev => ({
        ...prev,
        content: {
          blocks: [
            { id: Date.now().toString() + "1", type: 'serviceBanner', data: { title: 'New Service', subTitle: 'Services', backgroundImage: '' } },
            { id: Date.now().toString() + "2", type: 'serviceDetails', data: { 
                aboutTitle: "About The Service",
                aboutDescription: "Service details go here...",
                typesTitle: "Types Of Commercial Spaces",
                typesDescription: "In design, we bring characteristics...",
                elementsTitle: "Key Elements Of Interior Design",
                elementsDescription: "Several key elements are essential...",
                footerDescription: "Commercial interior design is a dynamic...",
                features: [{ title: "Space Optimization", description: "Through The Best Smart Space Optimisation." }],
                leftBullets: [{ text: "We provide high quality design services." }],
                rightBullets: [{ text: "Flexible with any structure of the building" }],
                faqs: [{ question: "What Interior Design Services Do You Offer?" }],
                sidebarImage: "", mainImage: "", midImage1: "", midImage2: ""
            } },
            { id: Date.now().toString() + "3", type: 'ctaSection', data: { badgeText: "GET IN TOUCH", title: "Have A Project In [Mind? Let's]\n[Make] It Happen", buttonText: "BOOK A FREE CONSULTATION" } }
          ]
        }
      }));
    }
  }, [id, isServicesMode, isEditMode]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const data = await pagesApi.getPageById(id);

      // Extract raw slug if the page path is like /services/residential
      let displaySlug = data.data.slug || '';
      if (isServicesMode && data.data.fullPath?.startsWith('/services/')) {
        displaySlug = data.data.fullPath.replace('/services/', '');
      }

      setFormData({
        title: data.data.title || '',
        slug: displaySlug, // 👉 Use the cleaned up slug
        excerpt: data.data.excerpt || '',
        status: data.data.status || 'DRAFT',
        template: data.data.template || 'default',
        content: data.data.content || { blocks: [] },
        metaTitle: data.data.metaTitle || '',
        metaDescription: data.data.metaDescription || '',
        metaKeywords: data.data.metaKeywords || '',
        includeInSitemap: data.data.includeInSitemap ?? true,
        noIndex: data.data.noIndex ?? false,
        noFollow: data.data.noFollow ?? false,
        canonicalUrl: data.data.canonicalUrl || '',
        ogTitle: data.data.ogTitle || '',
        ogDescription: data.data.ogDescription || '',
        ogImageId: data.data.ogImageId || null
      });
    } catch (err) {
      console.error('Failed to fetch page:', err);
      setError('Failed to load page. It may have been deleted or you lack permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Block Management
  const addBlock = (type) => {
    let defaultData = {};

    switch (type) {
      case 'heroSectionTwo':
        defaultData = { title: 'Find Your [Inspired]\n[Interior] Design', badgeText: 'FAST AND RELIABLE', description: 'Transform your vision into reality with our innovative designs, creating modern spaces that blend functionality, aesthetics, and sustainability.', watermarkText: 'Interior', backgroundImage: '' }; break;
      case 'aboutSectionTwo':
        defaultData = {
          title: 'Architecture\n[And Interiors, Our Dual]\nExpertise',
          badgeText: 'STARTED IN 1989',
          paragraph1: 'We believe that every space has the power to inspire, and that great design brings that inspiration to life. Our mission is to craft environments that stir creativity, evoke emotion, and reflect the essence of those who inhabit them.',
          paragraph2: 'With a strong presence in Kolkata, Bhubaneswar, and Ranchi, our turnkey office interiors are thoughtfully crafted to enhance productivity, reflect your brand identity, and support the way your team works every day.',
          buttonText: "Let's Get Started",
          image1: '', image2: '', image3: ''
        }; break;
      case 'servicesSectionTwo':
        defaultData = {
          title: 'Explore Our [Comprehensive]\n[Interior Design] Services',
          badgeText: 'OUR SERVICES',
          services: [
            { title: 'Initial Consultation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.', image: '' },
            { title: 'Design & Planning', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.', image: '' },
            { title: 'Implementation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.', image: '' }
          ]
        }; break;
      case 'processSectionTwo':
        defaultData = {
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
        }; break;
      case 'projectSliderTwo':
        defaultData = {
          projects: [
            { title: 'Industrial Elegance Condo', year: '2024', location: 'Kolkata', image: '' },
            { title: 'Residential Interior Design', year: '2024', location: 'Bhubaneswar', image: '' },
            { title: 'Serene Space Studio', year: '2024', location: 'Ranchi', image: '' },
            { title: 'Art Decor Revival', year: '2024', location: 'Kolkata', image: '' },
            { title: 'Modern Minimalist Oasis', year: '2024', location: 'Siliguri', image: '' },
            { title: 'Corporate Executive Suite', year: '2024', location: 'Delhi', image: '' }
          ]
        }; break;
      case 'trustedPartners':
        defaultData = {
          title: 'OUR [TRUSTED PARTNERS]',
          partners: [
            { name: 'Aristo', logo: '', heightClass: 'h-11 md:h-[44px]' },
            { name: 'Spitze', logo: '', heightClass: 'h-12 md:h-[48px]' },
            { name: 'Faber', logo: '', heightClass: 'h-11 md:h-[44px]' },
            { name: 'Everyday', logo: '', heightClass: 'h-12 md:h-[48px]' },
            { name: 'Fevicol', logo: '', heightClass: 'h-[54px] md:h-[60px]' },
            { name: 'Urban Ladder', logo: '', heightClass: 'h-11 md:h-[44px]' }
          ]
        }; break;
      case 'statsSectionTwo':
        defaultData = {
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
        }; break;
      case 'happySpaces':
        defaultData = {
          badgeText: 'STRAIGHT FROM THE NEWSROOM',
          titleLine1: 'Happy Spaces by',
          titleLine2: 'subhAAkritee',
          items: [
            { title: 'Functional Design Trends That Blend Style And Comfort', description: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: '', videoUrl: 'https://www.youtube.com/embed/62bIsvRcPv0' },
            { title: 'Functional Design Trends That Blend Style And Comfort', description: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: '', videoUrl: 'https://www.youtube.com/embed/62bIsvRcPv0' },
            { title: 'Functional Design Trends That Blend Style And Comfort', description: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: '', videoUrl: 'https://www.youtube.com/embed/62bIsvRcPv0' }
          ]
        }; break;
      case 'happyCustomers':
        defaultData = {
          title: 'OUR [HAPPY CUSTOMERS]',
          partners: [
            { name: 'Aristo', logo: '', heightClass: 'h-11 md:h-[44px]' },
            { name: 'Spitze', logo: '', heightClass: 'h-12 md:h-[48px]' },
            { name: 'Faber', logo: '', heightClass: 'h-11 md:h-[44px]' },
            { name: 'Everyday', logo: '', heightClass: 'h-12 md:h-[48px]' },
            { name: 'Fevicol', logo: '', heightClass: 'h-[54px] md:h-[60px]' },
            { name: 'Urban Ladder', logo: '', heightClass: 'h-11 md:h-[44px]' }
          ]
        }; break;
      case 'testimonialsTwo':
        defaultData = {
          title: 'Here s What [Warm Words]\n[Our Clients] Say',
          badgeText: 'OUR CLIENTS SAY',
          description: 'Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces functional and stylish commercial interiors',
          mainQuote: 'I absolutely love my the new modern living room! The clean lines, a neutral tones, and minimalist interior create such a calming & stylish atmosphere. Highly recommend their modern interior design services!',
          authorName: 'Morgan Dufresne',
          authorRole: 'Company owner',
          image: '',
          authorImage: ''
        }; break;
      case 'ctaSectionTwo':
        defaultData = { title: 'Have A Project In [Mind?] Let s\n[Make] It Happen', badgeText: 'GET IN TOUCH', buttonText: 'BOOK A FREE CONSULTATION' }; break;
      case 'richText':
        defaultData = { content: '' }; break;

      case 'contactForm':
        defaultData = {
          formId: '',
          formTitle: 'Get in Touch',
          submitButtonText: 'Submit Inquiry',
          redirectPath: ''
        }; break;
      case 'serviceBanner':
        defaultData = { 
          title: 'Residential Interior', 
          subTitle: 'Services', 
          backgroundImage: '' 
        }; 
        break;
        
      case 'serviceDetails':
        defaultData = {
          aboutTitle: "About The Service",
          aboutDescription: "Commercial interior design is constantly evolving...",
          typesTitle: "Types Of Commercial Spaces",
          typesDescription: "In design, we bring characteristics...",
          elementsTitle: "Key Elements Of Interior Design",
          elementsDescription: "Several key elements are essential...",
          footerDescription: "Commercial interior design is a dynamic...",
          features: [{ title: "Space Optimization", description: "Through The Best Smart Space Optimisation." }],
          leftBullets: [{ text: "We provide high quality design services." }],
          rightBullets: [{ text: "Flexible with any structure of the building" }],
          faqs: [{ question: "What Interior Design Services Do You Offer?" }],
          sidebarImage: "", mainImage: "", midImage1: "", midImage2: ""
        }; 
        break;
        
      case 'ctaSection':
        defaultData = { 
          badgeText: "GET IN TOUCH", 
          title: "Have A Project In [Mind? Let's]\n[Make] It Happen", 
          buttonText: "BOOK A FREE CONSULTATION" 
        }; 
        break;
      
      case 'contactBanner':
        defaultData = {
          title: "Contact Us",
          breadcrumbText: "Contact Us",
          backgroundImage: ""
        };
        break;

      case 'contactInfo':
        defaultData = {
          badgeText: 'GET IN TOUCH',
          title: "Have a Project In [Mind? Let's]\n[Make] It Happen.",
          addressTitle: 'Address:',
          addressText: 'Office: AG 40 , Sector II, Salt Lake\nCity, Kolkata: 700091',
          supportTitle: 'Support',
          supportPhone: '+91 9831-637-409',
          supportEmail: 'Subhaakritee@Hotmail.Com',
          workspaceImage: '',
          mapIframeUrl: '',
          formId: ''
        };
        break;

      case 'blogBanner':
        defaultData = {
          title: "Blog & Articles",
          breadcrumbText: "Blog",
          backgroundImage: ""
        };
        break;
        
      default:
        defaultData = {};
    }

    const newBlock = {
      id: Date.now().toString(),
      type: type,
      data: defaultData
    };

    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        blocks: [...(prev.content.blocks || []), newBlock]
      }
    }));
    setShowBlockMenu(false);
  };

  const removeBlock = (index) => {
    setFormData(prev => {
      const newBlocks = [...(prev.content.blocks || [])];
      newBlocks.splice(index, 1);
      return {
        ...prev,
        content: { ...prev.content, blocks: newBlocks }
      };
    });
  };

  const updateBlockData = (index, field, value) => {
    setFormData(prev => {
      const newBlocks = [...(prev.content.blocks || [])];
      newBlocks[index] = {
        ...newBlocks[index],
        data: {
          ...newBlocks[index].data,
          [field]: value
        }
      };
      return {
        ...prev,
        content: { ...prev.content, blocks: newBlocks }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...formData };
    
    if (isServicesMode) {
      if (payload.slug && !payload.slug.startsWith('services/')) {
        // We prepend 'services/' so the backend builds fullPath as '/services/slug'
        payload.slug = `services/${payload.slug}`;
      } else if (!payload.slug && payload.title) {
         payload.slug = `services/${payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      }
      payload.template = 'service-page';
    }

    if (payload.content && payload.content.blocks) {
      payload.content.blocks = payload.content.blocks.map(({ id, ...block }) => block);
    }
    if (!payload.slug || payload.slug.trim() === '') {
      delete payload.slug;
    }

    try {
      setSaving(true);
      setError(null);

      if (isEditMode) {
        await pagesApi.updatePage(id, payload);
      } else {
        await pagesApi.createPage(payload);
      }

      navigate(backPath);
    } catch (err) {
      console.error('Failed to save page:', err);
      setError(err.response?.data?.message || 'Failed to save page. Please check your inputs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-medium">Loading editor...</p>
      </div>
    );
  }

  if (isPuckMode) {
    const puckData = {
      content: (formData.content?.blocks || []).map(b => ({
        type: b.type,
        props: { ...(b.data || {}), id: b.id || b.data?.id || `puck-id-${Math.random().toString(36).slice(2)}` }
      })),
      root: { props: { title: formData.title || "" } },
      zones: {}
    };

    const handlePuckPublish = async (data) => {
      const blocks = (data.content || []).map(item => {
        const { id, ...cleanProps } = item.props || {};
        return {
          type: item.type,
          data: cleanProps,
          id: Date.now().toString() + Math.random().toString()
        };
      });

      const updatedContent = { ...formData.content, blocks };

      // Update local UI immediately and exit Puck mode
      setFormData(prev => ({ ...prev, content: updatedContent }));
      setIsPuckMode(false);

      // Auto-Save to backend
      const payload = { ...formData, content: updatedContent };

      if (isServicesMode) {
        if (payload.slug && !payload.slug.startsWith('services/')) {
          payload.slug = `services/${payload.slug}`;
        } else if (!payload.slug && payload.title) {
           payload.slug = `services/${payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        }
        payload.template = 'service-page';
      }

      if (payload.content && payload.content.blocks) {
        payload.content.blocks = payload.content.blocks.map(({ id, ...block }) => block);
      }
      if (!payload.slug || payload.slug.trim() === '') {
        delete payload.slug;
      }

      try {
        setSaving(true);
        setError(null);
        if (isEditMode) {
          await pagesApi.updatePage(id, payload);
        } else {
          const res = await pagesApi.createPage(payload);
          navigate(`${backPath}/edit/${res.data.id}`);
        }
      } catch (err) {
        console.error('Failed to save page:', err);
        setError(err.response?.data?.message || 'Failed to auto-save. Please try saving manually.');
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 flex flex-col transition-colors duration-300">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPuckMode(false)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Standard Editor
            </button>
            <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Puck Visual Editor</span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Click "Publish" in Puck to apply changes to the form</p>
        </div>
        <div className="flex-1 overflow-y-auto h-full min-h-[calc(100vh-70px)]">
          <Puck config={puckConfig} data={puckData} onPublish={handlePuckPublish} iframe={{ enabled: false }} />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500 pb-20 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <Link
            to={backPath}
            className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {isEditMode ? 'Edit Page' : (isServicesMode ? 'Create New Service' : 'Create New Page')}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              {isEditMode ? `Editing: ${formData.title}` : 'Draft a new page for your website.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Can permission="page.preview">
            <PreviewManager id={isEditMode ? id : null} entityType="page" />
          </Can>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 cursor-pointer transition-colors"
          >
            <option value="DRAFT">Draft</option>
            
            <Can 
              permission="page.publish" 
              fallback={<option value="PUBLISHED" disabled>Published (Requires Permission)</option>}
            >
              <option value="PUBLISHED">Published</option>
            </Can>

            {isEditMode && <option value="ARCHIVED">Archived</option>}
          </select>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-sm focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20 disabled:opacity-70"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white dark:border-zinc-900 border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Page
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm transition-colors duration-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-5 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3 transition-colors duration-300">
              <Layout className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
              General Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Page Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. About Us"
                  className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  URL Slug
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-2 font-normal">(Leave blank to auto-generate)</span>
                </label>
                <div className="flex rounded-xl shadow-sm">
                  <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 sm:text-sm font-mono transition-colors">
                    {isServicesMode ? '/services/' : '/'}
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="about-us"
                    className="flex-1 min-w-0 block w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors font-mono text-sm bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Excerpt (Short Description)</label>
                <textarea
                  name="excerpt"
                  rows="2"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="A brief summary of this page..."
                  className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 resize-y"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Page Builder / Content Blocks */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-5 transition-colors duration-300">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 transition-colors duration-300">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Type className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                  Content Blocks
                </h2>
                <button
                  type="button"
                  onClick={() => setIsPuckMode(true)}
                  className="px-3 py-1.5 bg-blue-900 dark:bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors flex items-center gap-1.5"
                >
                  <Layout className="w-4 h-4" /> Edit visually with Puck
                </button>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowBlockMenu(!showBlockMenu)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Block <ChevronDown className="w-4 h-4" />
                </button>
                
                {showBlockMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-black/50 rounded-xl py-2 z-20 max-h-[300px] overflow-y-auto transition-colors duration-300">
                    <div className="px-3 py-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Available Blocks</div>
                    {AVAILABLE_BLOCKS.map(b => (
                      <button
                        key={b.type}
                        type="button"
                        onClick={() => addBlock(b.type)}
                        className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-zinc-800 hover:text-blue-700 dark:hover:text-zinc-100 transition-colors"
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {(!formData.content?.blocks || formData.content.blocks.length === 0) ? (
                <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 transition-colors duration-300">
                  <Type className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No content blocks yet.</p>
                  <button
                    type="button"
                    onClick={() => addBlock('richText')}
                    className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    Add a Text Block
                  </button>
                </div>
              ) : (
                formData.content.blocks.map((block, index) => (
                  <div key={block.id || index} className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
                    <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        type="button"
                        onClick={() => removeBlock(index)}
                        className="bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 p-1.5 rounded-full shadow-sm hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
                        title="Remove Block"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-800 rounded-t-xl text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center transition-colors duration-300">
                      <span className="bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 w-5 h-5 rounded flex items-center justify-center mr-2 transition-colors">{index + 1}</span>
                      {AVAILABLE_BLOCKS.find(b => b.type === block.type)?.label || block.type}
                    </div>
                    <div className="p-0 border-t border-zinc-200 dark:border-zinc-800 relative transition-colors duration-300">
                      <DynamicBlockEditor
                        block={block}
                        index={index}
                        updateBlockData={updateBlockData}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-6 transition-colors duration-300">
            <h2 className="text-lg font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
              <Settings className="w-5 h-5 text-zinc-400 dark:text-zinc-500" /> Advanced SEO
            </h2>

            {/* Standard SEO */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-700 dark:text-zinc-300">Meta Title</label>
                <input type="text" value={formData.metaTitle || ''} onChange={e => setFormData(p => ({ ...p, metaTitle: e.target.value }))} placeholder="Keep empty to use page title" className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-700 dark:text-zinc-300">Meta Description</label>
                <textarea rows="3" value={formData.metaDescription || ''} onChange={e => setFormData(p => ({ ...p, metaDescription: e.target.value }))} className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm resize-y transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-700 dark:text-zinc-300">Meta Keywords</label>
                <input type="text" value={formData.metaKeywords || ''} onChange={e => setFormData(p => ({ ...p, metaKeywords: e.target.value }))} placeholder="interior, design, architecture" className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm transition-colors" />
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">Comma separated</p>
              </div>
            </div>

            {/* Crawler Rules */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4 transition-colors duration-300">
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Crawler Instructions</h3>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.includeInSitemap} onChange={e => setFormData(p => ({ ...p, includeInSitemap: e.target.checked }))} className="w-4 h-4 text-[#3B82F6] rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-[#3B82F6] dark:focus:ring-[#3B82F6]/50 dark:checked:bg-[#3B82F6] transition-colors" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">Include in Sitemap.xml</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.noIndex} onChange={e => setFormData(p => ({ ...p, noIndex: e.target.checked }))} className="w-4 h-4 text-red-500 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-red-500 dark:focus:ring-red-500/50 dark:checked:bg-red-500 transition-colors" />
                  <div>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium block">noIndex (Hide from Google)</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Search engines will drop this page from results.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.noFollow} onChange={e => setFormData(p => ({ ...p, noFollow: e.target.checked }))} className="w-4 h-4 text-amber-500 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-amber-500 dark:focus:ring-amber-500/50 dark:checked:bg-amber-500 transition-colors" />
                  <div>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium block">noFollow (Ignore Links)</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Crawlers won't follow any links on this page.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Social Graph */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4 transition-colors duration-300">
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Social Graph & Advanced</h3>

              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-700 dark:text-zinc-300">Canonical URL</label>
                <input type="url" value={formData.canonicalUrl || ''} onChange={e => setFormData(p => ({ ...p, canonicalUrl: e.target.value }))} placeholder="https://domain.com/original-source" className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm transition-colors" />
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">Use only if this content is copied from another URL.</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-700 dark:text-zinc-300">Social Share Title (OG Title)</label>
                <input type="text" value={formData.ogTitle || ''} onChange={e => setFormData(p => ({ ...p, ogTitle: e.target.value }))} placeholder="Facebook/Twitter Title" className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-700 dark:text-zinc-300">Social Share Description (OG Desc)</label>
                <textarea rows="2" value={formData.ogDescription || ''} onChange={e => setFormData(p => ({ ...p, ogDescription: e.target.value }))} placeholder="Facebook/Twitter Description" className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm resize-y transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-start mt-8 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 px-8 py-3 rounded-xl font-medium tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg shadow-zinc-900/20 dark:shadow-none disabled:opacity-70 text-sm w-full sm:w-auto"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white dark:border-zinc-900 border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default PageEditor;