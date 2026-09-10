import React from 'react';

const ProjectsFilter = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory 
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center md:justify-around gap-4 mb-16">
      {categories.map((cat) => {
        const isActive = selectedCategory.toUpperCase() === cat.toUpperCase();
        return (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-8 py-4 transition-colors duration-300 shrink-0 rounded-none cursor-pointer flex items-center justify-center ${
              isActive 
                ? 'bg-[#ffc300] text-black' 
                : 'bg-[#F7F7F7] hover:bg-[#EEEEEE] text-black'
            }`}
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 500,
              fontSize: '20px',
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'center',
              verticalAlign: 'middle'
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default ProjectsFilter;