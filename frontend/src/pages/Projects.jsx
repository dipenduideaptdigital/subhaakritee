import React, { useState, useEffect } from 'react';
import SEOHead from '../components/shared/SEOHead';
import ProjectsHero from '../components/projects/ProjectsHero';
import ProjectsFilter from '../components/projects/ProjectsFilter';
import ProjectCard from '../components/projects/ProjectCard';
import PageRenderer from '../components/shared/PageRenderer'; 
import useScrollAnimation from '../hooks/useScrollAnimation';

import { projectsApi } from '../api/projects'; 
import { pagesApi } from '../api/pages'; 

const categories = ['All', 'Residential', 'Commercial', 'Landscape', 'Interior'];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [projects, setProjects] = useState([]); 
  const [filteredProjects, setFilteredProjects] = useState([]);
  
  const [pageData, setPageData] = useState(null); 
  const [topBlocks, setTopBlocks] = useState([]);
  const [bottomBlocks, setBottomBlocks] = useState([]); 
  const [loading, setLoading] = useState(true);

  useScrollAnimation();

  useEffect(() => {
    document.title = 'Our Projects | Subhaakritee';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [projectsRes, pageRes] = await Promise.all([
          projectsApi.getPublicProjects().catch(() => ({ data: [] })),
          pagesApi.getPublicPageBySlug('projects').catch(() => ({ data: null }))
        ]);

        setProjects(projectsRes.data || []);
        setFilteredProjects(projectsRes.data || []);
        
        if (pageRes.data) {
          setPageData(pageRes.data);
          
          const allBlocks = pageRes.data.content?.blocks || [];
          setTopBlocks(allBlocks.filter(b => b.type === 'projectsBanner'));
          setBottomBlocks(allBlocks.filter(b => b.type !== 'projectsBanner'));
        }
      } catch (err) {
        console.error("Data load failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Filtering Logic
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase()));
    }
  }, [selectedCategory, projects]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffc300]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Inter'] flex flex-col">
      <SEOHead 
        data={{ 
          title: pageData?.metaTitle || 'Our Portfolio Projects | Subhaakritee', 
          metaDescription: pageData?.metaDescription || 'Explore our latest interior design projects.' 
        }} 
        type="page" 
      />

      {topBlocks.length > 0 ? (
        <PageRenderer blocks={topBlocks} />
      ) : (
        <ProjectsHero /> 
      )}

      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-[1728px] mt-20 flex-grow mb-20">
        <ProjectsFilter categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#F7F7F7] rounded-[2rem] max-w-xl mx-auto mt-12">
            <h3 className="text-xl font-bold text-black mb-2">No Projects Match</h3>
            <button onClick={() => setSelectedCategory('All')} className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider">View All Projects</button>
          </div>
        )}
      </div>

      {bottomBlocks.length > 0 && (
        <PageRenderer blocks={bottomBlocks} />
      )}
      
    </div>
  );
};

export default Projects;