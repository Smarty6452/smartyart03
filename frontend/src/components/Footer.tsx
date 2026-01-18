
import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 relative overflow-hidden">
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-charcoal-200 pt-6">
          <div className="mb-6 md:mb-0">
            <a href="#top" className="text-2xl font-serif text-ghost flex items-center gap-2">
              <span>Smarty <span className="text-blood">Art</span></span>
            </a>
            <p className="text-sm text-ghost/50 mt-2">
              Creative digital art & content creation
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <p className="text-sm text-ghost/50">
              © {new Date().getFullYear()} Rohit Bharti. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://instagram.com/smartyart03" target="_blank" rel="noopener noreferrer" className="text-ghost/50 hover:text-blood transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-ghost/50 hover:text-blood transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-ghost/50 hover:text-blood transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <svg
        className="absolute bottom-0 left-0 w-full h-24 fill-dark-200"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path d="M0,50 Q25,65 50,50 Q75,35 100,50 L100,100 L0,100 Z" />
      </svg>
    </footer>
  );
};

export default Footer;
