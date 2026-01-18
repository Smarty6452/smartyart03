// Navigation.jsx
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, Pencil } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen]);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-500',
        scrolled ? 'bg-dark-200/80 backdrop-blur-md border-b border-charcoal-200/50' : 'bg-transparent'
      )}
    >
      <div className="container flex items-center justify-between py-4">
        <a href="#top" className="flex items-center gap-2">
          {/* <Pencil size={20} className="text-blood" /> */}
          <span className="text-2xl font-serif font-semibold text-ghost">
            Smarty <span className="text-blood">Art</span>
            {/* <span className="text-sm ml-2 text-ghost/70 hidden sm:inline-block">Sketch Artist</span> */}
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {["Gallery", "Services", "About", "Process", "Contact"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-ghost/70 hover:text-ghost transition-colors relative group"
            >
              <span>{item}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blood group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-ghost p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <div className={cn(
          "fixed inset-0 bg-dark-300/95 flex flex-col items-center justify-center z-50 transition-all duration-500",
          isMenuOpen 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 translate-y-10 pointer-events-none"
        )}>
          <nav className="flex flex-col items-center gap-8">
            {["Gallery", "Services", "About", "Process", "Contact"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-2xl text-ghost/70 hover:text-ghost hover:text-shadow-red transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navigation;