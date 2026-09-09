import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../../assets/blog/hero.jpg';
import { resolveAssetUrl } from '../../utils/assetResolver';

const BlogHero = ({ title = "Blog", breadcrumbText = "Blog", backgroundImage }) => {
  const bgImage = backgroundImage ? resolveAssetUrl(backgroundImage) : heroImg;

  return (
    <div className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center bg-zinc-900">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="relative z-10 text-center text-white fade-in mt-16">
        <h1 className="text-6xl md:text-7xl font-bold font-['Outfit'] mb-6 tracking-tight drop-shadow-xl whitespace-pre-line">
          {title}
        </h1>
        <div className="flex items-center justify-center gap-3 text-sm md:text-base font-medium tracking-widest uppercase opacity-80">
          <Link to="/" className="hover:text-[#3B82F6] transition-colors">Home</Link>
          <span className="text-[#3B82F6] opacity-70">&gt;</span>
          <span>{breadcrumbText}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogHero;