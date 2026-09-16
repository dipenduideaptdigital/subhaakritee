import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import GetInTouch from '../landing/GetInTouch';
import WhatsAppButton from '../shared/WhatsAppButton';
import { ArrowUp } from 'lucide-react';
import apiClient from '../../api/client';

const MainLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    window.addEventListener('open-consultation-modal', handleOpenModal);
    window.addEventListener('close-consultation-modal', handleCloseModal);

    return () => {
      window.removeEventListener('open-consultation-modal', handleOpenModal);
      window.removeEventListener('close-consultation-modal', handleCloseModal);
    };
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      const hasSeen = sessionStorage.getItem('has_seen_consultation_modal');
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setIsModalOpen(true);
          sessionStorage.setItem('has_seen_consultation_modal', 'true');
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname]);

  return (
    <div className="font-sans antialiased text-gray-900 bg-white min-h-screen flex flex-col overflow-x-hidden relative">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />

      {/* Back to Top Button */}
      {isBackToTopEnabled && (
        <div
          className={`fixed bottom-28 right-6 z-[90] transition-all duration-500 ${
            showTopBtn ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-10 invisible'
          }`}
        >
        <button
          onClick={scrollToTop}
          className="flex items-center justify-center p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/40 text-[#ffc300] shadow-[0_0_20px_rgba(255,195,0,0.4)] hover:shadow-[0_0_30px_rgba(255,195,0,0.6)] hover:bg-white/20 transition-all duration-300 cursor-pointer"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>
      )}

      {/* Modal Consultation Form Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto z-10 transition-transform duration-300 transform scale-100 flex flex-col">
            <GetInTouch isModal={true} onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;