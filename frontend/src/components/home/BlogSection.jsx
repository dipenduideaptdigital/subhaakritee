import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { blogsApi } from '../../api/blogs'; 
import { resolveAssetUrl } from '../../utils/assetResolver';
import defaultThumbnail from '../../assets/homepage/gallery1.png';

const BlogSection = ({ data: externalData }) => {
  const [content, setContent] = useState(externalData || null);
  const [dynamicPosts, setDynamicPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCmsData = async () => {
      if (externalData) {
        if (isMounted) setContent(externalData);
      } else {
        try {
          const res = await apiClient.get('/cms/section/homepage_blog_section');
          if (res.data?.success && isMounted) setContent(res.data.data.content);
        } catch (error) {
          console.error('Failed to fetch blog section headers:', error);
        }
      }
    };

    const fetchLatestBlogs = async () => {
      try {
        const res = await blogsApi.getPublicBlogs({ limit: 3 });
        if (isMounted) {
          setDynamicPosts(res.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch dynamic blogs:', error);
      } finally {
        if (isMounted) setLoadingPosts(false);
      }
    };

    fetchCmsData();
    fetchLatestBlogs();

    return () => {
      isMounted = false;
    };
  }, [externalData]);

  const badgeText = content?.badgeText || "STRAIGHT FROM THE NEWSROOM";
  
  const title = content?.title || "Take A Look At [Our Latest] \\n [Blog] & Articles.";

  const renderTitle = (titleText) => {
    if (!titleText) return null;
    const parts = titleText.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-[#ffc300]">
            {part.slice(1, -1).split(/\\n|\n/).map((line, lIdx, arr) => (
              <React.Fragment key={lIdx}>
                {line}
                {lIdx < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        );
      }
      return part.split(/\\n|\n/).map((line, lIdx, arr) => (
        <React.Fragment key={lIdx}>
          {line}
          {lIdx < arr.length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };
  
  if (content?.isVisible === false) return null;

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl">
        
        <div className="relative mb-20 w-full flex flex-col md:flex-row md:justify-center items-start pt-6 md:pt-0">
          
          <div className="md:absolute left-0 top-0 mb-8 md:mb-0">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                {badgeText}
              </span>
            </div>
          </div>
          
          <div className="w-full flex justify-start md:justify-center">
            <div className="text-left fadeInLeft">
              <h2 className="text-5xl md:text-[56px] font-bold tracking-tight text-zinc-900 leading-[1.15]">
                {renderTitle(title)}
              </h2>
            </div>
          </div>
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loadingPosts ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col">
                <div className="w-full h-64 md:h-[350px] bg-zinc-200 rounded-[2.5rem] mb-6"></div>
                <div className="h-4 bg-zinc-200 rounded w-1/3 mb-3"></div>
                <div className="h-6 bg-zinc-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-zinc-200 rounded w-full"></div>
              </div>
            ))
          ) : dynamicPosts.length > 0 ? (
            dynamicPosts.map((post) => (
              <Link to={`/blog/${post.slug}`} key={post.id} className="group cursor-pointer flex flex-col opal-move-up">
                <div className="w-full h-64 md:h-[350px] rounded-[2.5rem] overflow-hidden mb-6 shadow-sm bg-zinc-100">
                  <img 
                    src={resolveAssetUrl(post.featuredImage?.url, defaultThumbnail)} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                <div className="px-2">
                  <p className="text-xs text-zinc-500 font-medium mb-3 flex items-center gap-2">
                    <span>By <span className="text-[#ffc300] hover:underline">{post.author?.name || 'Admin'}</span></span>
                    <span>•</span>
                    <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </p>
                  <h3 className="text-xl font-bold text-zinc-900 mb-3 group-hover:text-[#ffc300] transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-sm text-zinc-500 font-light leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))
          ) : (
             <div className="col-span-3 text-center py-10 text-zinc-500">No recent articles found.</div>
          )}
        </div>

      </div>
    </section>
  );
};

export default BlogSection;