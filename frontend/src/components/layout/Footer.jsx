import React, { useState, useEffect } from 'react';
import { FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../../assets/logos/logo2.svg';
import apiClient from '../../api/client';

const defaultCompanyLinks = [
  { label: "About Us", url: "/about" },
  { label: "Services", url: "/services" },
  { label: "Careers", url: "/careers" },
  { label: "Our Team", url: "/team" },
  { label: "Blog", url: "/blog" },
  { label: "Contact Us", url: "/contact" }
];

const defaultSupportLinks = [
  { label: "Our Project", url: "/projects" },
  { label: "Partners", url: "/partners" },
  { label: "Partners Program", url: "/partners-program" },
  { label: "Affiliate Program", url: "/affiliate-program" },
  { label: "Terms & Conditions", url: "/terms" },
  { label: "Support Center", url: "/support" }
];

const Footer = () => {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_footer');
        if (res.data?.success && res.data?.data?.content) {
          setFooterData(res.data.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch footer settings:', error);
      }
    };
    fetchFooter();
  }, []);

  const description = footerData?.description || "We transform your vision into beautifully crafted spaces.";
  const address = footerData?.address || "Office: AG 40 , Sector II, Salt Lake City,\nKolkata: 700091";
  const formattedAddress = address.replace(/\n/g, ' ');
  const phone = footerData?.phone || "+91 9831-637-409";
  const email = footerData?.email || "Subhaakritee@Hotmail.Com";
  
  const instagram = footerData?.instagram || "https://www.instagram.com/subhaakritee_design";
  const twitter = footerData?.twitter || "https://x.com/subhaakrite";
  const facebook = footerData?.facebook || "https://www.facebook.com/subhaakritee";
  const linkedin = footerData?.linkedin || "https://www.linkedin.com/company/subhaakritee/";

  const linksTitle1 = footerData?.linksTitle1 || "Support";
  const linksTitle2 = footerData?.linksTitle2 || "Company";

  const links1 = footerData?.links1 || defaultSupportLinks;
  const links2 = footerData?.links2 || defaultCompanyLinks;

  const copyrightText = footerData?.copyrightText || `Copyright Subhaakritee - All Rights Reserved.`;

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderLink = (link, idx) => {
    const isExternal = link.url?.startsWith('http');
    return (
      <li key={idx}>
        {isExternal ? (
          <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-blue-500 hover:translate-x-1 inline-block transition-all"
          >
            {link.label}
          </a>
        ) : (
          <Link 
            to={link.url} 
            onClick={handleLinkClick}
            className="hover:text-blue-500 hover:translate-x-1 inline-block transition-all"
          >
            {link.label}
          </Link>
        )}
      </li>
    );
  };

  return (
    <footer className="bg-zinc-950 text-white pt-14 sm:pt-20 pb-8 px-6 text-left">
      <div className="container mx-auto max-w-7xl">
        {/* Top Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-8 mb-12 sm:mb-16">
          
          {/* Column 1: Logo & Info */}
          <div className="col-span-2 lg:col-span-1 flex flex-col sm:flex-row lg:flex-col items-start justify-between gap-4 sm:gap-6">
            <Link to="/" onClick={handleLinkClick} className="flex items-center cursor-pointer transition-transform hover:scale-105 shrink-0">
              <img 
                src={logo} 
                alt="Subhaakritee Logo" 
                className="h-9 sm:h-10 md:h-12 w-auto object-contain" 
              />
            </Link>
            
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-[280px] font-light">
              {description}
            </p>
            
            <div className="space-y-1 sm:space-y-1.5 shrink-0 mb-5">
              <h4 className="text-xs sm:text-sm font-semibold tracking-wider text-gray-200 uppercase">Kolkata</h4>
              <p className="text-gray-400 text-xs leading-relaxed max-w-[240px] font-light">
                {formattedAddress}
              </p>
            </div>
          </div>

          {/* Column 2: Company Links */}
          <div className="col-span-1 flex flex-col items-start text-left lg:pl-4 ml-15">
            <h4 className="text-xs sm:text-sm font-semibold tracking-wider text-gray-200 uppercase mb-3 sm:mb-4">{linksTitle2}</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-gray-400 font-light text-xs sm:text-sm flex flex-col items-start">
              {links2.map(renderLink)}
            </ul>
          </div>

          {/* Column 3: Support Links */}
          <div className="col-span-1 flex flex-col items-start text-left ml-14">
            <h4 className="text-xs sm:text-sm font-semibold tracking-wider text-gray-200 uppercase mb-3 sm:mb-4">{linksTitle1}</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-gray-400 font-light text-xs sm:text-sm flex flex-col items-start">
              {links1.map(renderLink)}
            </ul>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="col-span-2 lg:col-span-1 space-y-5 sm:space-y-6 flex flex-col items-center text-center lg:items-start lg:text-left pt-2 sm:pt-0">
            <div>
              <h4 className="text-xs sm:text-sm font-semibold tracking-wider text-gray-200 uppercase mb-2">Contact</h4>
              <a 
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`} 
                className="block text-base sm:text-sm lg:text-xl font-medium text-white hover:text-blue-400 transition-colors cursor-pointer whitespace-nowrap mb-1"
              >
                {phone}
              </a>
              <a 
                href={`mailto:${email}`} 
                className="text-blue-400 text-xs sm:text-sm font-light hover:text-blue-300 transition-colors break-all"
              >
                {email}
              </a>
            </div>
            
            <div className="flex justify-center lg:justify-start">
              <div className="flex space-x-3 sm:space-x-4">
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all hover:-translate-y-1 group" aria-label="Instagram">
                  <FaInstagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a href={twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all hover:-translate-y-1 group" aria-label="Twitter">
                  <FaTwitter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all hover:-translate-y-1 group" aria-label="Facebook">
                  <FaFacebookF className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all hover:-translate-y-1 group" aria-label="LinkedIn">
                  <FaLinkedinIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>
          
        </div>

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-zinc-800/50 text-[11px] sm:text-xs text-gray-500 font-light gap-3 sm:gap-0 text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} {copyrightText}</p>
          <p className="flex items-center gap-1">
            Designed & Developed By <a href="#" className="text-gray-300 font-medium hover:text-white transition-colors">IdeaptDigital</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;