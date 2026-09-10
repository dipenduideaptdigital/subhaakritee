import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { resolveAssetUrl } from '../../utils/assetResolver';
import defaultThumbnailPlaceholder from '../../assets/blog/sample1.png';

const BlogSidebar = ({ sidebarData, onSearchSubmit, activeCategorySlug, onCategorySelect, onTagSelect }) => {
  const [localSearchInputTerm, setLocalSearchInputString] = useState('');
  const navigate = useNavigate();

  const handleSearchKeyPressFormSignal = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(localSearchInputTerm.trim());
    }
  };

  const structuralCategoriesList = sidebarData?.categories || [];
  const structuralRecentPostsList = sidebarData?.recentPosts || [];
  const structuralPopularTagsList = sidebarData?.popularTags || [];

  return (
    <div className="space-y-12">
      <div>
        <h3 className="font-['Outfit'] text-[32px] md:text-[43px] font-semibold leading-none text-zinc-900 mb-6">Search</h3>
        <form onSubmit={handleSearchKeyPressFormSignal} className="relative">
          <input 
            type="text" 
            placeholder="Search...." 
            value={localSearchInputTerm}
            onChange={(e) => setLocalSearchInputString(e.target.value)}
            className="w-full border border-zinc-200 rounded-full py-3.5 px-6 pr-12 focus:outline-none focus:border-[#ffc300] focus:ring-1 focus:ring-[#ffc300] transition-all text-base font-extralight text-zinc-600 placeholder-zinc-400"
          />
          <button type="submit" className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-[#ffc300] transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Dynamic Relational Categories Tracker */}
      {structuralCategoriesList.length > 0 && (
        <div>
          <h3 className="font-['Outfit'] text-[32px] md:text-[43px] font-semibold leading-none text-zinc-900 mb-6">Categories</h3>
          <ul className="flex flex-col border-t border-zinc-200">
            {structuralCategoriesList.map((category) => {
              const isSelectedNode = activeCategorySlug === category.slug;
              return (
                <li 
                  key={category.id} 
                  onClick={() => onCategorySelect && onCategorySelect(category.slug)}
                  className={`font-['Montserrat'] text-[18px] md:text-[22px] font-semibold capitalize border-b border-zinc-200 py-4 flex justify-between items-center transition-colors cursor-pointer ${
                    isSelectedNode ? 'text-[#ffc300]' : 'text-zinc-600 hover:text-[#ffc300]'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className="text-xs font-bold bg-zinc-100 text-zinc-500 px-2.5 py-1 rounded-full border border-zinc-200/60">
                    {category._count?.blogs || 0}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Dynamic Recent Posts Timeline Feeds */}
      {structuralRecentPostsList.length > 0 && (
        <div className="space-y-6 pt-4">
          <h3 className="font-['Outfit'] text-[28px] font-semibold leading-none text-zinc-900 mb-4">Recent Posts</h3>
          {structuralRecentPostsList.map((post) => {
            const computedThumbImgLink = resolveAssetUrl(post.featuredImage?.thumbnailUrl, defaultThumbnailPlaceholder);
            return (
              <div 
                key={post.id || post.slug} 
                onClick={() => navigate(`/blog/${post.slug}`)} 
                className="flex gap-4 group cursor-pointer border-b border-zinc-50 pb-4 last:border-0"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-100 bg-zinc-50 shadow-inner">
                  <img 
                    src={computedThumbImgLink} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <h4 className="font-bold text-zinc-900 text-[14px] md:text-[15px] mb-2 leading-snug group-hover:text-[#ffc300] transition-colors line-clamp-2 text-left">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400 font-semibold tracking-wider">
                      {new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dynamic Taxonomies Tags Matrix Cloud */}
      {structuralPopularTagsList.length > 0 && (
        <div>
          <h3 className="font-['Outfit'] text-[32px] md:text-[43px] font-semibold leading-none text-zinc-900 mb-6 mt-6">Popular Tags</h3>
          <div className="flex flex-wrap justify-center gap-2.5">
            {structuralPopularTagsList.map((tag) => (
              <span 
                key={tag.id} 
                onClick={() => onTagSelect && onTagSelect(tag.slug)}
                className="px-4 py-2 border border-zinc-200 rounded-full text-[12px] md:text-[13px] font-medium text-zinc-600 hover:border-[#ffc300] hover:text-[#ffc300] cursor-pointer bg-white hover:bg-[#ffc300]/10 transition-all shadow-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogSidebar;