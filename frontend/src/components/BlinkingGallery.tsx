
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface BlinkingGalleryProps {
  images: string[];
  interval?: number;
  className?: string;
}

const BlinkingGallery: React.FC<BlinkingGalleryProps> = ({ 
  images, 
  interval = 3000,
  className = "" 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIndex(activeIndex);
      setIsTransitioning(true);
      
      setTimeout(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [activeIndex, images.length, interval]);

  if (images.length === 0) return null;

  return (
    <div className={cn("relative overflow-hidden rounded-lg border border-charcoal-200/60 shadow-lg", className)}>
      {images.map((image, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-500",
            index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0",
            isTransitioning && index === activeIndex && "animate-scale-in",
            isTransitioning && index === prevIndex && "animate-fade-out"
          )}
        >
          <img
            src={image}
            alt={`Gallery image ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-300/70 via-transparent to-transparent" />
        </div>
      ))}
      <div className="absolute bottom-3 right-3 bg-dark-200/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-ghost/70 z-20">
        {activeIndex + 1}/{images.length}
      </div>
    </div>
  );
};

export default BlinkingGallery;
