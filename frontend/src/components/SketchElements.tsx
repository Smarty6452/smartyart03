
import React, { useEffect } from 'react';

interface SketchElementsProps {
  count?: number;
  className?: string;
}

const SketchElements: React.FC<SketchElementsProps> = ({ count = 10, className = "" }) => {
  useEffect(() => {
    // Create SVG elements with animation
    const container = document.getElementById('sketch-container');
    if (!container) return;
    
    // Clear existing elements
    container.innerHTML = '';
    
    // Create SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("class", "absolute inset-0 pointer-events-none");
    
    // Generate random sketch elements
    for (let i = 0; i < count; i++) {
      const isCircle = Math.random() > 0.7;
      
      if (isCircle) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const r = Math.random() * 3 + 1;
        
        circle.setAttribute("cx", `${x}%`);
        circle.setAttribute("cy", `${y}%`);
        circle.setAttribute("r", `${r}`);
        circle.setAttribute("class", "sketch-line");
        circle.setAttribute("style", `animation-delay: ${i * 0.1}s`);
        
        svg.appendChild(circle);
      } else {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        const x1 = Math.random() * 100;
        const y1 = Math.random() * 100;
        const x2 = x1 + (Math.random() - 0.5) * 20;
        const y2 = y1 + (Math.random() - 0.5) * 20;
        
        line.setAttribute("x1", `${x1}%`);
        line.setAttribute("y1", `${y1}%`);
        line.setAttribute("x2", `${x2}%`);
        line.setAttribute("y2", `${y2}%`);
        line.setAttribute("class", "sketch-line");
        line.setAttribute("style", `animation-delay: ${i * 0.1}s`);
        
        svg.appendChild(line);
      }
    }
    
    container.appendChild(svg);
  }, [count]);

  return (
    <div id="sketch-container" className={`absolute inset-0 z-0 opacity-30 ${className}`}></div>
  );
};

export default SketchElements;
