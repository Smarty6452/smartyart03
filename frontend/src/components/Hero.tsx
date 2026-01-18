// Hero.jsx
import React, { useEffect, useState } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import FloatingShapes from './FloatingShapes';

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="top" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Animated particle background */}
      <AnimatedBackground />
      
      {/* Floating geometric shapes */}
      <FloatingShapes />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-300 via-transparent to-dark-200 z-10" />
      <div className="absolute inset-0 bg-gradient-radial from-blood/5 via-transparent to-transparent z-10" />
      
      {/* Main content */}
      <div className="container relative z-20 flex flex-col items-center px-4">
        {/* Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-blood/10 border border-blood/30 rounded-full mb-8 animate-fade-in">
          <Sparkles size={16} className="text-blood" />
          <span className="text-sm text-ghost/80">Custom Art Commissions Available</span>
        </div>

        {/* Main title with animated gradient */}
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif mb-6 text-center font-semibold tracking-tighter animate-fade-in">
          <span className="text-ghost relative inline-block">
            Smarty
            <span className="absolute -inset-1 bg-ghost/5 blur-xl -z-10" />
          </span>
          <span className="text-blood relative inline-block ml-2">
            Art
            <span className="absolute -inset-1 bg-blood/20 blur-xl -z-10" />
          </span>
        </h1>
        
        <h2 className="text-2xl md:text-3xl lg:text-4xl text-ghost/80 mb-4 text-center font-serif animate-fade-in opacity-0" 
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          Sketch Artist & Digital Creator
        </h2>
        
        <p className="text-lg md:text-xl text-ghost/60 max-w-2xl text-center mb-10 animate-fade-in opacity-0 leading-relaxed" 
           style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          Transforming your ideas into captivating visual experiences. 
          From charcoal portraits to digital masterpieces — bringing your vision to life.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in opacity-0" 
             style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <Link
            to="/book"
            className="px-8 py-4 bg-blood hover:bg-blood/80 text-ghost font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(139,0,0,0.5)] text-center"
          >
            Book Custom Art
          </Link>
          <a
            href="#gallery"
            className="px-8 py-4 border border-ghost/30 hover:border-blood text-ghost font-semibold rounded-lg transition-all duration-300 hover:bg-ghost/5 text-center"
          >
            View Portfolio
          </a>
        </div>
        
        {/* Artist Image with glow effect */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 mb-12 animate-fade-in opacity-0 group" 
             style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          {/* Glow ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-blood via-ghost/20 to-blood rounded-full opacity-50 blur-xl group-hover:opacity-80 transition-opacity duration-500 animate-pulse" />
          
          {/* Image container */}
          <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-blood/50">
            <img 
              src="/smartyart-uploads/0305903a-f904-41a0-a1ca-e8e51712c147.png" 
              alt="Rohit Bharti - Sketch Artist" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          
          {/* Decorative ring */}
          <div className="absolute inset-0 border border-ghost/10 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        
        {/* Scroll indicator */}
        <a 
          href="#gallery" 
          className="text-ghost/50 flex flex-col items-center gap-2 hover:text-blood transition-colors animate-fade-in opacity-0" 
          style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}
        >
          <span className="text-xs tracking-widest uppercase">Explore My Work</span>
          <ArrowDown className="animate-float" size={20} />
        </a>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-200 to-transparent z-10" />
    </section>
  );
};

export default Hero;