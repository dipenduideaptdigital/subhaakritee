import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import apiClient from '../../api/client';
import teamFallback from '../../assets/homepage/team.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const defaultTeamMembers = [
  { id: '01', name: 'Mark Jackson', role: 'Co-Founder & CEO' },
  { id: '02', name: 'Valeria Novikova', role: 'Lighting Specialist' },
  { id: '03', name: 'Alex Podzemsky', role: 'Graphics Designer' },
  { id: '04', name: 'Helen Reeves', role: 'Material Consultant' },
  { id: '05', name: 'Jake Nicholson', role: '3D Visualisation' },
];

const Team = ({ data: externalData }) => {
  const [activeMember, setActiveMember] = useState('01');
  const [content, setContent] = useState(externalData || null);

  useEffect(() => {
    let isMounted = true;
    if (externalData) {
      setContent(externalData);
      return () => { isMounted = false; };
    }

    const fetchTeamData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_team');
        const { data } = res;
        if (data.success && data.data?.content && isMounted) {
          setContent(data.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch team content:', error);
      }
    };
    fetchTeamData();
    return () => { isMounted = false; };
  }, [externalData]);

  const badgeText = content?.badgeText || "AMAZING DESIGN TEAM";
  const title = content?.title || "Meet The [Experts Our \\n Interior] Designers";
  const description = content?.description || "Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces functional and stylish commercial interiors";
  const teamMembers = content?.members || defaultTeamMembers;

  const renderTitle = (titleText) => {
    if (!titleText) return null;
    const parts = titleText.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-[#3B82F6]">
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

  const currentMemberData = teamMembers.find(m => (m.id || m.name) === activeMember) || teamMembers[0];
  const displayImage = currentMemberData?.image ? resolveAssetUrl(currentMemberData.image) : teamFallback;

  if (content?.isVisible === false) return null;
  
  return (
    <>
      <style>
        {`
          @keyframes smoothFrameSlideBlur {
            0% {
              transform: translateX(-50px);
              filter: blur(8px);
              opacity: 0.2;
            }
            100% {
              transform: translateX(0);
              filter: blur(0px);
              opacity: 1;
            }
          }
          .animate-frame-slide-blur {
            /* Changed to 0.8s ease-out for a smooth and calm entry */
            animation: smoothFrameSlideBlur 0.8s ease-out forwards;
          }
        `}
      </style>

      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6 md:px-8 max-w-[1400px]"> 
          
          <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8 md:gap-12">
            <div className="md:w-5/12 fadeInLeft">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300">
                <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
                <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                  {badgeText}
                </span>
              </div>
            </div>
            
            <div className="md:w-7/12 flex flex-col items-start fadeInRight">
              <h2 className="text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight text-gray-900 mb-6 leading-[1.05]">
                {renderTitle(title)}
              </h2>
              <p className="text-gray-500 font-normal text-base md:text-lg leading-relaxed max-w-2xl">
                {description}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            
            <div 
              key={displayImage}
              className="w-full lg:w-5/12 h-[400px] md:h-[500px] lg:h-[600px] rounded-[2.5rem] overflow-hidden shadow-sm shrink-0 relative bg-gray-100 animate-frame-slide-blur"
            >
               <img 
                 src={displayImage} 
                 alt={currentMemberData.name} 
                 className="w-full h-full object-cover" 
               />
            </div>

            <div className="w-full lg:w-7/12 flex flex-col border-t-2 border-black fadeInRight relative">
              {teamMembers.map((member, index) => {
                const memberId = member.id || `0${index + 1}`;
                const isActive = activeMember === memberId;
                
                return (
                  <div 
                    key={index}
                    className={`group flex items-center justify-between py-4 md:py-6 border-b-2 cursor-pointer transition-colors duration-300 ${
                      isActive
                        ? 'border-[#3B82F6] z-10' 
                        : 'border-black hover:bg-gray-50/50'
                    }`}
                    onMouseEnter={() => setActiveMember(memberId)}
                  >
                    <div className="flex items-center gap-6 sm:gap-16 w-full">
                      <span className="text-base font-medium text-gray-900 w-8">
                        {memberId}
                      </span>
                      <span className={`text-xl sm:text-2xl font-bold flex-1 transition-colors duration-300 ${isActive ? 'text-[#3B82F6]' : 'text-gray-900'}`}>
                        {member.name}
                      </span>
                      <span className="text-sm text-gray-500 font-normal hidden sm:block w-48 text-left">
                        {member.role}
                      </span>
                    </div>
                    
                    {isActive ? (
                      <div className="w-12 h-12 rounded-full bg-[#3B82F6] flex items-center justify-center text-white shrink-0">
                        <ArrowRight strokeWidth={2.5} className="w-7 h-7" /> 
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-gray-900 shrink-0">
                        <ArrowUpRight strokeWidth={2} className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
};

export default Team;