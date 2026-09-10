import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi } from '../../api/projects';
import { resolveAssetUrl } from '../../utils/assetResolver';

const ProjectShowcase = ({ currentProjectSlug }) => {
  const [relatedProjects, setRelatedProjects] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await projectsApi.getPublicProjects({ limit: 4 }); 
        const filtered = res.data
          .filter(p => p.slug !== currentProjectSlug)
          .slice(0, 3);
        setRelatedProjects(filtered);
      } catch (err) {
        console.error("Failed to fetch related projects", err);
      }
    };
    fetchRelated();
  }, [currentProjectSlug]);

  if (relatedProjects.length === 0) return null;

  return (
    <div className="container mx-auto px-4 md:px-5 max-w-7xl py-16 md:py-24 bg-white">
      {/* Heading Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_4.5fr] gap-8 md:gap-12 mb-21 items-start">
        <div className="shrink-0 mt-2">
          <div className="inline-flex items-center space-x-2 px-4 py-2.5 ml-15  rounded-full border border-zinc-200 bg-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#F97316] shadow-[0_0_6px_rgba(249,115,22,0.6)]"></span>
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-zinc-500 font-['Helvetica']">
              GET IN TOUCH
            </span>
          </div>
        </div>
        <div className="max-w-3xl text-left ml-20">
          <h2 className="text-[40px] md:text-[50px] lg:text-[70px] font-bold tracking-[-0.04em] text-gray-900 leading-[1.1] capitalize font-['Helvetica']">
            Explore <span className="text-[#ffc300]">Our Project</span>
            <br />
            <span className="text-[#ffc300]">Showcase</span>
          </h2>
        </div>
      </div>

      {/* 3-Column Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {relatedProjects.map((project) => (
          <Link 
            key={project.id}
            to={`/projects/${project.slug}`}
            className="group flex flex-col text-left cursor-pointer transition-all duration-300"
          >
            <div className="w-full rounded-[2.2rem] overflow-hidden aspect-[4/5] shadow-md group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1.5 bg-zinc-100">
              <img 
                src={resolveAssetUrl(project.featuredImage?.url || project.featuredImageId, '/default-project.png')} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <h3 className="text-2xl font-bold font-['Helvetica'] text-gray-900 mb-2 mt-6 group-hover:text-[#ffc300] transition-colors leading-tight">
              {project.title}
            </h3>
            <p className="text-gray-500 font-['Helvetica'] text-sm md:text-base leading-relaxed line-clamp-2">
              {project.description || 'Improving spaces with expert craftsmanship.'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectShowcase;