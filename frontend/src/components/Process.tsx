
import React, { useEffect } from 'react';

const ProcessStep = ({ number, title, description, delay }: { number: number; title: string; description: string; delay: number }) => {
  return (
    <div 
      className="relative reveal-on-scroll" 
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-dark-100 border border-charcoal-200 flex items-center justify-center">
          <span className="text-xl text-blood">{number}</span>
        </div>
        <div>
          <h3 className="text-xl font-serif mb-2">{title}</h3>
          <p className="text-ghost/70">{description}</p>
        </div>
      </div>
      
      {number < 4 && (
        <div className="absolute left-6 top-12 w-0.5 h-16 bg-charcoal-200"></div>
      )}
    </div>
  );
};

const Process = () => {
  useEffect(() => {
    // Add ink splatter effect on scroll
    const inkSplatters = document.querySelectorAll('.ink-splatter');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-ink-spread');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    inkSplatters.forEach(splatter => {
      observer.observe(splatter);
    });
    
    return () => {
      inkSplatters.forEach(splatter => {
        observer.unobserve(splatter);
      });
    };
  }, []);

  return (
    <section id="process" className="py-24 relative">
      <div className="container relative">
        <h2 className="text-4xl md:text-5xl font-serif mb-4 text-center reveal-on-scroll">Creative Process</h2>
        <p className="text-ghost/70 text-center max-w-xl mx-auto mb-16 reveal-on-scroll">
          Witness the journey from concept to creation, where darkness is transformed into art through careful technique and haunting vision.
        </p>
        
        <div className="max-w-3xl mx-auto relative">
          <div className="space-y-16">
            <ProcessStep 
              number={1} 
              title="Initial Concept" 
              description="Every piece begins with a shadow of an idea, often inspired by dreams, literature, or glimpses of emotion captured in fleeting moments of darkness."
              delay={0.1}
            />
            
            <ProcessStep 
              number={2} 
              title="Preliminary Sketches" 
              description="Rough sketches explore the concept, focusing on composition, emotion, and the balance between detail and negative space that creates tension."
              delay={0.2}
            />
            
            <ProcessStep 
              number={3} 
              title="Refined Drawing" 
              description="Meticulous attention is paid to shadow and light, creating depth that draws viewers into the unsettling beauty of each piece."
              delay={0.3}
            />
            
            <ProcessStep 
              number={4} 
              title="Final Enhancements" 
              description="Select pieces receive digital enhancements to amplify their haunting quality, a marriage of traditional technique and modern technology."
              delay={0.4}
            />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute right-0 bottom-0 w-48 h-48 ink-splatter opacity-0 transform translate-x-1/2 translate-y-1/4"></div>
          <div className="absolute left-0 top-0 w-32 h-32 ink-splatter opacity-0 transform -translate-x-1/2 -translate-y-1/4"></div>
        </div>
        
        {/* Studio image */}
        <div className="mt-24 reveal-on-scroll">
          <div className="relative rounded-md overflow-hidden flex ">
            <img 
              src="/smartyart-uploads/9148ee61-33d9-462d-a6f0-91f8359dc515.png" 
              alt="Artist studio" 
              className="w-[80%] rounded-md h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-300 to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <h3 className="text-2xl md:text-3xl font-serif mb-2">Where Nightmares Take Form</h3>
              <p className="text-ghost/80 max-w-2xl">
                The studio is more than a workspace—it's a sanctuary where darkness is embraced and transformed into art that resonates with the shadows within us all.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
