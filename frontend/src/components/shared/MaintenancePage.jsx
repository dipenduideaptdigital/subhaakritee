import React from 'react';
import { Settings, Mail, Phone, Clock, Wrench } from 'lucide-react';
import logo from '../../assets/logos/logo2.svg';

const MaintenancePage = ({ data }) => {
  const { 
    title, 
    description, 
    estimatedCompletion, 
    supportEmail, 
    supportPhone 
  } = data || {};

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center relative overflow-hidden bg-zinc-950 font-sans px-4 sm:px-6">
      
      {/* Animated Background Orbs (Premium Feel) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#3B82F6]/20 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDuration: '4s' }}></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#F97316]/15 rounded-full blur-[100px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-900/50 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Main Content Wrapper (Card styling removed, perfectly centered) */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center animate-in fade-in duration-1000">
        
        {/* Logo */}
        <div className="mb-12 animate-in slide-in-from-top-8 duration-1000 delay-150 flex flex-col items-center">
          <img src={logo} alt="Subhaakritee" className="h-10 md:h-12 w-auto brightness-0 invert opacity-90 drop-shadow-lg" />
          <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-zinc-400 mt-4 font-semibold">The Design People</p>
        </div>

        {/* Animated Icon Wrapper */}
        <div className="relative w-24 h-24 mb-10 flex items-center justify-center animate-in fade-in zoom-in duration-700 delay-300">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="w-20 h-20 bg-zinc-800/80 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-12 transition-transform duration-500 z-10 backdrop-blur-md">
            <Settings className="w-10 h-10 text-blue-400 animate-[spin_6s_linear_infinite]" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center backdrop-blur-md z-20">
            <Wrench className="w-5 h-5 text-orange-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-['Outfit'] text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight animate-in slide-in-from-bottom-6 duration-700 delay-500">
          {title || "We're Upgrading"}
        </h1>
        
        {/* Description */}
        <p className="text-zinc-400 text-sm md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-12 font-light animate-in slide-in-from-bottom-6 duration-700 delay-700">
          {description || "Our digital space is undergoing a premium makeover. We are working diligently behind the scenes and will be back shortly with an improved experience."}
        </p>

        {/* ETA Badge */}
        {estimatedCompletion && (
          <div className="inline-flex items-center gap-3 bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 text-zinc-300 px-6 py-3 rounded-full text-sm font-medium mb-12 shadow-inner animate-in fade-in duration-700 delay-1000">
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="opacity-80">Estimated Ready Time:</span>
            <span className="text-white font-bold tracking-wide">
              {new Date(estimatedCompletion).toLocaleString(undefined, { 
                weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
              })}
            </span>
          </div>
        )}

        {/* Contact Links */}
        <div className="w-full pt-10 animate-in fade-in duration-700 delay-1000">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {supportEmail && (
              <a href={`mailto:${supportEmail}`} className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 w-full sm:w-auto justify-center backdrop-blur-sm">
                <Mail className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" /> 
                <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{supportEmail}</span>
              </a>
            )}
            {supportPhone && (
              <a href={`tel:${supportPhone}`} className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 w-full sm:w-auto justify-center backdrop-blur-sm">
                <Phone className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" /> 
                <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{supportPhone}</span>
              </a>
            )}
          </div>
        </div>

      </div>

      {/* Decorative lines */}
      <div className="absolute top-0 bottom-0 left-6 md:left-12 border-l border-white/5 pointer-events-none"></div>
      <div className="absolute top-0 bottom-0 right-6 md:right-12 border-r border-white/5 pointer-events-none"></div>
    </div>
  );
};

export default MaintenancePage;