import React, { useState, useEffect } from 'react';
import { ChevronDown, Phone, Menu, X } from 'lucide-react';
import { pagesApi } from '../../api/pages';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logos/logo2.svg'; 

const Navbar = () => {
  const [pages, setPages] = useState([]);
  const [servicePages, setServicePages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesMobileOpen, setIsServicesMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
    setIsServicesMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await pagesApi.getPublicPages();
        const allPages = response.data || [];
        
        const excludeSlugs = [
          'services', 'service', 
          'about', 'about-us', 
          'projects', 'project', 'our-projects',
          'contact', 'contact-us', 
          'blog', 'blogs',
          'home', 'homepage'
        ];
        
        const fetchedServicePages = allPages.filter(page => {
          return page.fullPath?.startsWith('/services/') && page.showInMenu !== false;
        });
        setServicePages(fetchedServicePages);

        const filteredPages = allPages.filter(page => {
          const currentSlug = (page.slug || '').toLowerCase().trim();
          
          if (excludeSlugs.includes(currentSlug)) return false;
          if (page.fullPath?.startsWith('/services/')) return false; 
          if (page.showInMenu === false) return false;

          return true;
        });
        
        setPages(filteredPages);
      } catch (err) {
        console.error('Failed to load navbar pages:', err);
      }
    };
    fetchPages();
  }, [location.pathname]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    
    if (location.pathname !== '/') {
      navigate(`/#${targetId}`);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 0; 
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between text-white bg-gradient-to-b from-black/50 to-transparent">
      {/* Logo Section */}
      <Link to="/" className="flex items-center cursor-pointer">
        <img 
          src={logo} 
          alt="Subhaakritee Logo" 
          className="h-10 md:h-12 w-auto object-contain" 
        />
      </Link>

      {/* Navigation Links */}
      <div className="hidden lg:flex items-center space-x-12 text-base font-light">
        <Link 
          to="/about" 
          className="flex items-center hover:text-gray-300 transition-colors"
        >
          About
        </Link>
        
        <div className="relative group">
          <Link 
            to="/services" 
            className="flex items-center hover:text-gray-300 transition-colors py-2"
          >
            Services <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
          </Link>
          
          <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100 overflow-hidden text-gray-800 font-normal">
            {servicePages.length > 0 ? (
              <ul className="py-2">
                {servicePages.map((page) => (
                  <li key={page.id}>
                    <Link
                      to={page.fullPath ? (page.fullPath.startsWith('/') ? page.fullPath : `/${page.fullPath}`) : `/${page.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 italic">No specific services added yet</div>
            )}
          </div>
        </div>

        <Link 
          to="/projects" 
          className="flex items-center hover:text-gray-300 transition-colors"
        >
          Projects
        </Link>
        
        {/* Dynamic Pages Dropdown */}
        {/* <div className="relative group">
          <button className="flex items-center hover:text-gray-300 transition-colors py-2">
            Pages <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
          </button>
          
          <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100 overflow-hidden text-gray-800 font-normal">
            {pages.length > 0 ? (
              <ul className="py-2">
                {pages.map((page) => (
                  <li key={page.id}>
                    <Link
                      to={page.fullPath ? (page.fullPath.startsWith('/') ? page.fullPath : `/${page.fullPath}`) : `/${page.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 italic">No pages found</div>
            )}
          </div>
        </div> */}

        <Link 
          to="/blog" 
          className="hover:text-gray-300 transition-colors py-2"
        >
          Blog
        </Link>
        <Link 
          to="/contact" 
          className="flex items-center hover:text-gray-300 transition-colors"
        >
          Contact Us
        </Link>
      </div>

      {/* Right Actions */}
      <div className="hidden md:flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <Phone className="w-5 h-5 text-white" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold">Contact Us</span>
            <span className="text-[10px] opacity-80">+91 9831-637-409</span>
          </div>
        </div>
        
        <button 
          onClick={(e) => {
            e.preventDefault();
            window.dispatchEvent(new Event('open-consultation-modal'));
          }}
          className="bg-[#ffc300] hover:bg-[#e6b000] text-black px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-[#ffc300]/40 cursor-pointer"
        >
          Get A Quote!
        </button>

      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="lg:hidden text-white bg-black/25 hover:bg-black/35 p-2.5 rounded-full backdrop-blur-md transition-all focus:outline-none z-50 cursor-pointer border border-white/10"
      >
        {isOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
      </button>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 lg:hidden animate-fade-in"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-zinc-950/75 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Header of Drawer */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <span className="font-bold text-lg text-white">Menu</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300 p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)} 
              className="text-[17px] font-semibold text-white/90 hover:text-white hover:translate-x-1 transition-all py-1 animate-in fade-in slide-in-from-right-3 duration-200"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsOpen(false)} 
              className="text-[17px] font-semibold text-white/90 hover:text-white hover:translate-x-1 transition-all py-1 animate-in fade-in slide-in-from-right-3 duration-250"
            >
              About
            </Link>

            {/* Collapsible Services */}
            <div className="flex flex-col">
              <button 
                onClick={() => setIsServicesMobileOpen(!isServicesMobileOpen)}
                className="flex items-center justify-between text-[17px] font-semibold text-white/90 hover:text-white py-1 focus:outline-none w-full text-left animate-in fade-in slide-in-from-right-3 duration-300"
              >
                <span>Services</span>
                <ChevronDown className={`w-4 h-4 ml-1 opacity-70 transition-transform duration-200 ${isServicesMobileOpen ? 'rotate-180 text-blue-400' : ''}`} />
              </button>
              
              {isServicesMobileOpen && (
                <div className="flex flex-col space-y-3 mt-2 pl-4 py-2 border-l border-white/5 bg-white/5 rounded-lg animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link 
                    to="/services" 
                    onClick={() => setIsOpen(false)} 
                    className="text-sm font-medium text-gray-300 hover:text-white"
                  >
                    All Services
                  </Link>
                  {servicePages.length > 0 ? (
                    servicePages.map((page) => (
                      <Link
                        key={page.id}
                        to={page.fullPath ? (page.fullPath.startsWith('/') ? page.fullPath : `/${page.fullPath}`) : `/${page.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-medium text-gray-300 hover:text-white capitalize"
                      >
                        {page.title}
                      </Link>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500 italic">No services available</span>
                  )}
                </div>
              )}
            </div>

            <Link 
              to="/projects" 
              onClick={() => setIsOpen(false)} 
              className="text-[17px] font-semibold text-white/90 hover:text-white hover:translate-x-1 transition-all py-1 animate-in fade-in slide-in-from-right-3 duration-350"
            >
              Projects
            </Link>
            <Link 
              to="/blog" 
              onClick={() => setIsOpen(false)} 
              className="text-[17px] font-semibold text-white/90 hover:text-white hover:translate-x-1 transition-all py-1 animate-in fade-in slide-in-from-right-3 duration-400"
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsOpen(false)} 
              className="text-[17px] font-semibold text-white/90 hover:text-white hover:translate-x-1 transition-all py-1 animate-in fade-in slide-in-from-right-3 duration-450"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="pt-6 border-t border-white/5">
          <button 
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
              window.dispatchEvent(new Event('open-consultation-modal'));
            }}
            className="w-full bg-[#ffc300] hover:bg-[#e6b000] text-black py-3 rounded-xl text-[15px] font-bold transition-all shadow-lg hover:shadow-[#ffc300]/40 cursor-pointer text-center"
          >
            Get A Quote!
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;