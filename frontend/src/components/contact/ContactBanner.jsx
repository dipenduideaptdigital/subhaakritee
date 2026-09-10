import React from 'react';
import { Link } from 'react-router-dom';
import bannerImg from '../../assets/homepage/play.jpg'; 

const ContactBanner = () => {
  return (
    <div className="relative w-full h-[300px] md:h-[380px] lg:h-[420px] flex items-center justify-center overflow-hidden bg-zinc-900 font-helvetica">
      
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="relative z-10 text-center px-6 flex flex-col items-center opal-move-up mt-10">
        
        <h1 className="font-['Montserrat',sans-serif] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[54px] lg:leading-[62px] text-white mb-3 tracking-normal text-center capitalize drop-shadow-xl whitespace-pre-line">
          Contact Us
        </h1>
        
        <div className="font-['Helvetica',sans-serif] font-medium text-xs sm:text-sm md:text-base tracking-widest text-center flex items-center justify-center space-x-3 text-gray-200 uppercase opacity-80">
          <Link to="/" className="hover:text-[#3B82F6] transition-colors">Home</Link>
        
          <span className="text-[#3B82F6] opacity-70">&gt;</span>
          
          <span className="text-white">Contact Us</span>
        </div>

      </div>
    </div>
  );
};

export default ContactBanner;