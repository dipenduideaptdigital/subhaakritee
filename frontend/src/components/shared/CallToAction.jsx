import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-7xl py-12 border-t border-zinc-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Badge */}
        <div className="lg:col-span-3 lg:pr-4">
          <div className="inline-flex items-center gap-2 border border-zinc-200 rounded-full px-4 py-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-[#F97316]"></span>
            <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              Get In Touch
            </span>
          </div>
        </div>
        
        {/* Right Column: Content */}
        <div className="lg:col-span-9 flex flex-col items-start">
          <h2 className="font-['Outfit'] text-[40px] md:text-[68px] font-bold text-zinc-900 leading-[1.1] tracking-tight mb-12">
            Have A Project In <span className="text-[#ffc300]">Mind?&nbsp;Let's<br/>Make</span> It Happen
          </h2>
          
          <button className="group inline-flex items-center gap-4 border border-zinc-300 rounded-full pl-6 pr-2 py-2 hover:border-[#ffc300] transition-colors">
            <span className="text-[13px] font-bold tracking-wider text-zinc-600 uppercase group-hover:text-zinc-900 transition-colors">
              Book A Free Consultation
            </span>
            <div className="w-10 h-10 rounded-full bg-[#ffc300] flex items-center justify-center text-black transition-transform group-hover:scale-105">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
