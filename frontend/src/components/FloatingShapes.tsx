import React from 'react';

const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-blood/20 rotate-45 animate-float" 
           style={{ animationDelay: '0s', animationDuration: '8s' }} />
      <div className="absolute top-40 right-20 w-24 h-24 border border-ghost/10 rotate-12 animate-float" 
           style={{ animationDelay: '2s', animationDuration: '10s' }} />
      <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-blood/5 rotate-45 animate-float" 
           style={{ animationDelay: '1s', animationDuration: '7s' }} />
      <div className="absolute top-1/3 right-1/3 w-20 h-20 border-2 border-charcoal-200/30 rounded-full animate-float" 
           style={{ animationDelay: '3s', animationDuration: '9s' }} />
      
      {/* Sketch lines */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-10">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B0000" stopOpacity="0" />
            <stop offset="50%" stopColor="#8B0000" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8B0000" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0,100 Q200,50 400,100 T800,100" stroke="url(#lineGrad)" strokeWidth="1" fill="none" className="animate-draw-in" />
        <path d="M100,0 Q150,200 100,400 T100,800" stroke="url(#lineGrad)" strokeWidth="1" fill="none" className="animate-draw-in" style={{ animationDelay: '0.5s' }} />
      </svg>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blood/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-ghost/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
    </div>
  );
};

export default FloatingShapes;
