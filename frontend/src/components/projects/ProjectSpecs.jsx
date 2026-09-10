import React from 'react';
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../utils/assetResolver';

const ProjectSpecs = ({ project }) => {
  if (!project) return null;

  // Dynamic values from backend
  const projectType = project.category || 'Not Specified';
  const clientName = project.client || 'Not Specified';
  const locationName = project.location || 'Not Specified';
  const areaSize = project.area || 'Not Specified';
  const imageUrl = resolveAssetUrl(project.featuredImage?.url || project.featuredImageId, '/default-project.png');

  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-35 max-w-[1400px] py-16 md:py-20 font-sans bg-white">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] md:text-xs font-semibold tracking-wider text-zinc-400 uppercase mb-4 font-['Outfit'] select-none">
        <Link to="/" className="hover:text-[#ffc300] transition-colors">Home</Link>
        <span className="text-zinc-300 font-normal">&gt;</span>
        <Link to="/projects" className="hover:text-[#ffc300] transition-colors">Projects</Link>
        <span className="text-zinc-300 font-normal">&gt;</span>
        <span className="text-zinc-500 font-medium">{project.title}</span>
      </div>

      {/* Styled Project Title */}
      <h1 
        className="text-zinc-950 mb-10 font-['Outfit'] tracking-normal align-middle capitalize text-left"
        style={{
          fontWeight: 600,
          fontStyle: 'normal',
          fontSize: '50px',
          lineHeight: '100%',
          letterSpacing: '0%',
          verticalAlign: 'middle'
        }}
      >
        {project.title}
      </h1>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-left mb-8">
        <div>
          <span className="text-zinc-400 text-sm md:text-base block mb-1">Project Type:</span>
          <span className="text-zinc-900 font-bold text-base md:text-lg">{projectType}</span>
        </div>
        <div>
          <span className="text-zinc-400 text-sm md:text-base block mb-1">Client:</span>
          <span className="text-zinc-900 font-bold text-base md:text-lg">{clientName}</span>
        </div>
        <div>
          <span className="text-zinc-400 text-sm md:text-base block mb-1">Location:</span>
          <span className="text-zinc-900 font-bold text-base md:text-lg">{locationName}</span>
        </div>
        <div>
          <span className="text-zinc-400 text-sm md:text-base block mb-1">Area:</span>
          <span className="text-zinc-900 font-bold text-base md:text-lg">{areaSize}</span>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-zinc-200 mb-1 " />

      {/* Showcase Image */}
      <div className="w-full rounded-[2rem] overflow-hidden  mt-10 mb-2 h-[280px] md:h-[480px] lg:h-[570px]">
        <img 
          src={imageUrl} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ProjectSpecs;