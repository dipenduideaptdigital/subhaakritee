import React from 'react';
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../utils/assetResolver';
import defaultHero from '../../assets/blog/hero.jpg';

const BlogDetailHero = ({ post }) => {
  if (!post) return null;

  const bgImage = resolveAssetUrl(post.featuredImage?.url, defaultHero);

  return (
    <div className="relative h-[55vh] min-h-[400px] max-h-[600px] w-full flex items-center justify-center">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-zinc-900"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent"></div>
      </div>
      
      <div className="relative z-10 text-center text-white fade-in mt-16 px-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center flex-wrap gap-3 text-sm md:text-base font-medium opacity-100 tracking-widest uppercase mb-6 drop-shadow-md">
          <Link to="/" className="hover:text-[#3B82F6] transition-colors">Home</Link>
          <span className="text-zinc-300 font-light">&gt;</span>
          <Link to="/blog" className="hover:text-[#3B82F6] transition-colors">Blog</Link>
          <span className="text-zinc-300 font-light">&gt;</span>
          <span className="text-[#ffc300] font-bold">{post.categories?.[0]?.name || 'Article'}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailHero;