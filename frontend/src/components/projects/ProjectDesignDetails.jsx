import React from 'react';
import { Image } from 'lucide-react';

const ProjectDesignDetails = ({ project }) => {
  if (!project) return null;

  const bulletPoints = project.bulletPoints?.length > 0 ? project.bulletPoints : [
    'Flexible with any structure of the building',
    'Commitment to customer service',
    'Experienced, time-served engineers',
    'We are confident about our projects.'
  ];

  const spaces = project.spaces?.length > 0 ? project.spaces : [
    { size: '(30M2)', label: 'Bedroom' },
    { size: '(22M2)', label: 'Bathroom' },
    { size: '(28M2)', label: 'Workspace' },
    { size: '(15M2)', label: 'Kitchen area' }
  ];

  return (
    <div className="container mx-auto px-3 md:px-10 lg:px-15 max-w-[1400px] pb-10 font-sans bg-white">
      {/* Design in Details Section */}
      <div className="max-w-4xl mx-auto text-left mb-16 md:mb-20">
        <h2 
          className="font-['Outfit'] mb-6 text-[28px] md:text-[36px] lg:text-[43px] text-zinc-950 align-middle"
          style={{
            fontWeight: 600,
            fontStyle: 'normal',
            lineHeight: '100%',
            letterSpacing: '0%',
            verticalAlign: 'middle'
          }}
        >
          Design in Details
        </h2>
        
        <div 
          className="text-zinc-500 text-[15px] md:text-[16px] leading-relaxed mb-10 prose prose-zinc max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: project.details || '<p>Details coming soon for this project.</p>' 
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-16">
          {bulletPoints.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffc300] shrink-0 mt-2"></span>
              <span 
                className="text-zinc-900 font-['Outfit'] select-none text-left text-base md:text-lg lg:text-[20px] leading-relaxed"
                style={{ fontWeight: 600, fontStyle: 'normal' }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>

        <div className="border border-zinc-200 rounded-[24px] overflow-hidden grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-zinc-200 bg-white mb-15">
          {spaces.map((space, idx) => (
            <div key={idx} className="p-8 text-center flex flex-col justify-center items-center">
              <span className="text-3xl md:text-4xl font-extrabold text-zinc-900 mb-2 font-['Outfit']">
                {space.size}
              </span>
              <span className="text-zinc-500 text-sm font-medium">
                {space.label}
              </span>
            </div>
          ))}
        </div>

        {/* Incredible Result Section */}
        <div className="border-t border-zinc-200 pt-16">
          <h2 
            className="font-['Outfit'] mb-6 text-[28px] md:text-[36px] lg:text-[43px] text-zinc-950 align-middle"
            style={{ fontWeight: 600, fontStyle: 'normal', lineHeight: '100%', verticalAlign: 'middle' }}
          >
            Incredible Result
          </h2>
          
          <div 
            className="text-zinc-500 text-[15px] md:text-[16px] leading-relaxed mb-10 prose prose-zinc max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: project.description || '<p>Our interior designers use human-centered approaches to address how we live today. Creating novel approaches to promoting health, safety, and welfare, contemporary interiors are increasingly inspired by biophilia as a holistic approach to design.</p>' 
            }}
          />

          {/* Photos Button */}
          <button 
            className="bg-[#ffc300] hover:bg-[#ffc300] text-white font-medium px-8 py-3.5 rounded-full inline-flex items-center gap-2.5 transition-all shadow-lg hover:shadow-blue-500/20 cursor-pointer"
          >
            <Image className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wide">Photos</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProjectDesignDetails;