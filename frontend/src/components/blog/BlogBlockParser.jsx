import React, { memo } from 'react';
import { resolveAssetUrl } from '../../utils/assetResolver';

const BlockRendererNode = memo(({ block }) => {
  const { type, data } = block;

  switch (type) {
    case 'image':
      return (
        <figure className="my-10 w-full rounded-2xl overflow-hidden shadow-sm">
          <img 
            src={resolveAssetUrl(data?.url)} 
            alt={data?.caption || "Blog Image"} 
            className="w-full h-auto object-cover" 
          />
          {data?.caption && (
            <figcaption className="text-center text-sm text-zinc-500 italic mt-3">
              {data.caption}
            </figcaption>
          )}
        </figure>
      );
    case 'video':
      const isVimeo = data?.platform === 'vimeo';
      const embedUrl = isVimeo 
        ? `https://player.vimeo.com/video/${data?.videoId}`
        : `https://www.youtube.com/embed/${data?.videoId}`;
        
      return (
        <div className="my-10 w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-zinc-100">
          <iframe 
            src={embedUrl}
            title="Video Player"
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    case 'gallery':
      const imagesArray = data?.images || [];
      if (imagesArray.length === 0) return null;

      return (
        <div className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {imagesArray.map((imgUrl, idx) => (
            <div key={idx} className="w-full h-[250px] rounded-xl overflow-hidden shadow-sm border border-zinc-100">
              <img src={resolveAssetUrl(imgUrl)} alt="Gallery Item" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
            </div>
          ))}
        </div>
      );
    case 'heading':
      return (
        <h2 
          className="font-['Outfit'] text-[28px] md:text-[34px] font-bold text-zinc-900 tracking-tight mb-6 mt-10 text-left"
          dangerouslySetInnerHTML={{ __html: data?.text || data?.content || '' }}
        />
      );
    case 'paragraph':
      return (
        <div 
          className="mb-6 text-[16px] md:text-[19px] text-zinc-500 leading-relaxed font-normal text-left prose prose-zinc max-w-none prose-a:text-[#ffc300] hover:prose-a:text-[#e6b000]"
          dangerouslySetInnerHTML={{ __html: data?.text || data?.content || '' }}
        />
      );
    case 'richText':
      return (
        <div 
          className="prose prose-zinc max-w-none text-left mb-6 text-zinc-500 text-[16px] md:text-[19px] leading-relaxed prose-headings:text-zinc-900 prose-headings:font-bold prose-a:text-[#ffc300]"
          dangerouslySetInnerHTML={{ __html: data?.content || '' }}
        />
      );
    case 'quote':
      return (
        <div className="bg-[#EBF5FF] rounded-3xl p-8 md:p-12 relative mt-8 mb-8 overflow-hidden flex flex-col items-center justify-center text-center min-h-[200px]">
          <div className="absolute top-2 opacity-20 left-1/2 -translate-x-1/2 font-serif text-[150px] leading-none text-[#ffc300] select-none pointer-events-none">
            &ldquo;
          </div>
          <div className="relative z-10 pt-4">
            <div 
              className="text-lg md:text-2xl font-bold text-zinc-900 leading-snug mb-4 max-w-2xl mx-auto italic prose prose-lg prose-zinc max-w-none prose-p:my-0"
              dangerouslySetInnerHTML={{ __html: data?.text || data?.content || '' }}
            />
          </div>
        </div>
      );
    case 'divider':
      return <div className="w-full h-px bg-zinc-200 my-10 border-0" />;
    default:
      return null;
  }
});

const BlogBlockParser = ({ contentPayload }) => {
  const structuralBlocksArray = contentPayload?.blocks || [];

  if (structuralBlocksArray.length === 0) {
    return <p className="italic text-zinc-400 text-left my-8">No content provided for this publication.</p>;
  }

  return (
    <div className="w-full font-['Outfit']">
      {structuralBlocksArray.map((block, idx) => (
        <BlockRendererNode key={block.id || idx} block={block} />
      ))}
    </div>
  );
};

export default BlogBlockParser;