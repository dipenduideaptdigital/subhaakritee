import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/logos/logo2.svg';

const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
  }, [location.pathname]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsOpen(false);

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`/#${targetId}`);
    }
  };

  const handleCtaClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    window.dispatchEvent(new Event('open-consultation-modal'));
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between text-white bg-gradient-to-b from-black/50 to-transparent font-sans">
      {/* Logo Section */}
      <Link to="/" className="flex items-center cursor-pointer">
        <img 
          src={logo} 
          alt="Subhaakritee Logo" 
          className="h-10 md:h-12 w-auto object-contain" 
        />
      </Link>

      {/* Navigation Links */}
      <div className="hidden lg:flex items-center space-x-12 text-base font-light text-white">
        <a href="#services" onClick={(e) => handleNavClick(e, 'services')} className="hover:text-[#ffc300] transition-colors">
          Services
        </a>
        <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="hover:text-[#ffc300] transition-colors">
          Projects
        </a>
        <a href="#process" onClick={(e) => handleNavClick(e, 'process')} className="hover:text-[#ffc300] transition-colors">
          Process
        </a>
        <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-[#ffc300] transition-colors">
          About
        </a>
        <a href="#blog" onClick={(e) => handleNavClick(e, 'blog')} className="hover:text-[#ffc300] transition-colors">
          Blog
        </a>
      </div>

      {/* Desktop CTA */}
      <div className="hidden lg:block">
        <button 
          onClick={handleCtaClick} 
          className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-blue-500/30 cursor-pointer"
        >
          Book A Free Consultation
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
            <a 
              href="#services" 
              onClick={(e) => handleNavClick(e, 'services')} 
              className="text-[17px] font-semibold text-white/90 hover:text-[#ffc300] hover:translate-x-1 transition-all py-1 animate-in fade-in slide-in-from-right-3 duration-200"
            >
              Services
            </a>
            <a 
              href="#projects" 
              onClick={(e) => handleNavClick(e, 'projects')} 
              className="text-[17px] font-semibold text-white/90 hover:text-[#ffc300] hover:translate-x-1 transition-all py-1 animate-in fade-in slide-in-from-right-3 duration-250"
            >
              Projects
            </a>
            <a 
              href="#process" 
              onClick={(e) => handleNavClick(e, 'process')} 
              className="text-[17px] font-semibold text-white/90 hover:text-[#ffc300] hover:translate-x-1 transition-all py-1 animate-in fade-in slide-in-from-right-3 duration-300"
            >
              Process
            </a>
            <a 
              href="#about" 
              onClick={(e) => handleNavClick(e, 'about')} 
              className="text-[17px] font-semibold text-white/90 hover:text-[#ffc300] hover:translate-x-1 transition-all py-1 animate-in fade-in slide-in-from-right-3 duration-350"
            >
              About
            </a>
            <a 
              href="#blog" 
              onClick={(e) => handleNavClick(e, 'blog')} 
              className="text-[17px] font-semibold text-white/90 hover:text-[#ffc300] hover:translate-x-1 transition-all py-1 animate-in fade-in slide-in-from-right-3 duration-400"
            >
              Blog
            </a>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="pt-6 border-t border-white/5">
          <button 
            onClick={handleCtaClick} 
            className="w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-xl text-[15px] font-semibold transition-all shadow-lg hover:shadow-blue-500/20 cursor-pointer text-center"
          >
            Book A Free Consultation
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;