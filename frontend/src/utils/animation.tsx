
import { useEffect } from 'react';

export const useRevealAnimation = (selector = '.reveal-on-scroll') => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [selector]);
};

export const useParallaxEffect = () => {
  useEffect(() => {
    const handleScroll = () => {
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach((element) => {
        const speed = parseFloat(element.getAttribute('data-speed') || '0.5');
        const yPos = -(window.scrollY * speed);
        // Fix the TypeScript error by using setAttribute instead of style
        element.setAttribute('style', `transform: translateY(${yPos}px)`);
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};
