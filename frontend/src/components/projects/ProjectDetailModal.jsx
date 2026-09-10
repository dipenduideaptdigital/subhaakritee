import React from 'react';
import { X, Calendar, MapPin, Layers } from 'lucide-react';
import { resolveAssetUrl } from '../../utils/assetResolver';

const ProjectDetailModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div 
          className="fixed inset-0 bg-zinc-900/65 backdrop-blur-sm transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-zinc-100">
          
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 z-20 p-2.5 bg-zinc-950/80 hover:bg-[#ffc300] text-white rounded-full transition-colors backdrop-blur-md shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12">
            
            <div className="md:col-span-7 relative aspect-[4/3] md:aspect-auto md:h-[550px] bg-zinc-100">
              <img 
                src={resolveAssetUrl(project.featuredImage?.url || project.featuredImageId, '/default-project.png')} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full border border-white/20 bg-black/45 backdrop-blur-md text-white text-[9px] tracking-widest uppercase font-bold">
                  {project.category}
                </span>
              </div>
            </div>

            <div className="md:col-span-5 p-8 flex flex-col justify-between h-[550px] overflow-y-auto">
              <div>
                <div className="flex items-center gap-4 text-zinc-400 text-[10px] tracking-widest uppercase font-semibold mb-4">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#ffc300]" /> {project.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#ffc300]" /> {project.year}
                  </span>
                </div>

                <h2 className="font-['Outfit'] text-3xl font-bold text-zinc-900 leading-snug mb-4">
                  {project.title}
                </h2>

                <p className="text-zinc-600 font-light text-sm leading-relaxed mb-6">
                  {project.details}
                </p>
              </div>

              <div className="border-t border-zinc-100 pt-6 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-widest">
                    <Layers className="w-4 h-4 text-zinc-400" /> Client
                  </span>
                  <span className="text-zinc-900 font-semibold">{project.client || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-widest">
                    <Layers className="w-4 h-4 text-zinc-400" /> Covered Area
                  </span>
                  <span className="text-zinc-900 font-semibold">{project.area || 'N/A'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;