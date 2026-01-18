
import React, { useEffect, useRef } from 'react';

const About = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    
    // Create sketch elements dynamically
    const svg = svgRef.current;
    
    // Generate random lines
    for (let i = 0; i < 15; i++) {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      const x = 50 + (Math.random() - 0.5) * 100;
      const y = 50 + (Math.random() - 0.5) * 100;
      const r = Math.random() * 5 + 1;
      
      circle.setAttribute("cx", x.toString());
      circle.setAttribute("cy", y.toString());
      circle.setAttribute("r", r.toString());
      circle.setAttribute("class", "sketch-line");
      circle.setAttribute("style", `animation-delay: ${i * 0.2}s`);
      
      svg.appendChild(circle);
    }
  }, []);

  return (
    <section id="about" className="py-24 relative">
      <div className="container">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="reveal-on-scroll">
            <h2 className="text-4xl font-serif mb-6">About Rohit Bharti</h2>
            <p className="text-ghost/70 mb-4">
              Content Creator & Social Media Manager based in Kitchener, specializing in engaging visual content and creative digital assets including posters, logos, and AI-generated artwork.
            </p>
            <p className="text-ghost/70 mb-6">
              With experience in UI/UX design and frontend development, I create visually compelling experiences that enhance brand storytelling capabilities while working in agile environments.
            </p>
            
            <div className="flex gap-4">
              <div className="bg-charcoal-200 p-4 rounded-md flex-1">
                <h3 className="text-lg font-medium mb-2">Education</h3>
                <p className="text-sm text-ghost/70">Conestoga College - Web Development, BSc Computer Engineering</p>
              </div>
              <div className="bg-charcoal-200 p-4 rounded-md flex-1">
                <h3 className="text-lg font-medium mb-2">Experience</h3>
                <p className="text-sm text-ghost/70">SmartyArt Brand, Unmetered Technologies</p>
              </div>
            </div>
          </div>
          
          <div className="relative reveal-on-scroll">
            <div className="relative z-10 aspect-[3/4] overflow-hidden rounded-md">
              <img 
                src="/smartyart-uploads/2e50a9fe-17ee-48ab-aded-9302f3f9d0e6.png"
                alt="Rohit Bharti portrait" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-300 via-transparent to-transparent"></div>
            </div>
            
            {/* SVG sketch overlay */}
            <svg
              ref={svgRef}
              className="absolute top-0 left-0 w-full h-full -z-10 transform translate-x-6 translate-y-6"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            ></svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
