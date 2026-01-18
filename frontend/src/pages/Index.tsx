
import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';
import About from '@/components/About';
import Process from '@/components/Process';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import SketchElements from '@/components/SketchElements';
import { useRevealAnimation, useParallaxEffect } from '@/utils/animation';

const Index = () => {
  useRevealAnimation();
  useParallaxEffect();

  useEffect(() => {
    // Initialize cursor effect
    const cursor = document.createElement('div');
    cursor.classList.add('fixed', 'w-6', 'h-6', 'rounded-full', 'bg-blood/30', 'pointer-events-none', 'z-50', 'mix-blend-screen', 'backdrop-blur-sm');
    cursor.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(cursor);

    const updateCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    window.addEventListener('mousemove', updateCursor);

    // Scroll-to-section smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId as string);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
            behavior: 'smooth'
          });
        }
      });
    });

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', updateCursor);
      cursor.remove();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-dark-300 text-ghost overflow-hidden">
      <Navigation />
      <Hero />
      
      {/* Divider */}
      <div className="relative h-24 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full fill-dark-200"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          height="100%"
          width="100%"
        >
          <path d="M0,0 Q50,50 100,0 L100,100 L0,100 Z" />
        </svg>
      </div>
      
      <div className="bg-dark-200 relative">
        <SketchElements count={15} />
        <Gallery />
        <About />
      </div>
      
      {/* Divider */}
      <div className="relative h-24 overflow-hidden bg-dark-200">
        <svg
          className="absolute bottom-0 w-full fill-dark-300"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          height="100%"
          width="100%"
        >
          <path d="M0,0 L100,0 L100,100 Q50,50 0,100 Z" />
        </svg>
      </div>
      
      <Services />
      <Process />
      <Contact />
      <Footer />
      
      {/* Background horror effect */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03] mix-blend-overlay">
        <div className="absolute inset-0 horror-bg"></div>
      </div>
    </div>
  );
};

export default Index;
