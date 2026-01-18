
import React, { useState } from 'react';
import { Download, CheckCircle } from 'lucide-react';

const Services = () => {
  const [downloadingPoster, setDownloadingPoster] = useState(false);

  const handleDownloadPoster = () => {
    setDownloadingPoster(true);
    // Simulate download delay
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '/smartyart-uploads/0305903a-f904-41a0-a1ca-e8e51712c147.png';
      link.download = 'SmartyArt_Portrait_Pricing.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadingPoster(false);
    }, 1500);
  };

  return (
    <section id="services" className="py-24 relative bg-dark-300">
      <div className="container">
        <h2 className="text-4xl md:text-5xl font-serif mb-4 text-center reveal-on-scroll">
          My Services
        </h2>
        <p className="text-ghost/70 text-center max-w-xl mx-auto mb-12 reveal-on-scroll">
          From traditional sketches to digital art, I offer a range of portrait services to capture your vision with precision and creativity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="reveal-on-scroll">
            <div className="bg-dark-100 border border-charcoal-200 rounded-lg overflow-hidden">
              <img 
                src="/smartyart-uploads/0305903a-f904-41a0-a1ca-e8e51712c147.png"
                alt="SmartyArt Portrait Pricing"
                className="w-full h-auto hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleDownloadPoster}
                disabled={downloadingPoster}
                className="flex items-center gap-2 px-6 py-3 bg-blood hover:bg-blood/80 text-ghost rounded-md transition-colors"
              >
                {downloadingPoster ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-l-2 border-ghost"></span>
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>Download Price List</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="reveal-on-scroll">
            <h3 className="text-3xl font-serif mb-6">All Portrait Sketches</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-serif text-blood mb-2">Starts From $60</h4>
                <p className="text-ghost/70">
                  High-quality portraits that capture the essence and personality of your subject with meticulous attention to detail.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-serif mb-2">Available Styles</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Charcoal", "Digital", "Sketching", "Event Arts"].map((style) => (
                    <li key={style} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-blood" />
                      <span>{style}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-serif mb-2">Available Sizes</h4>
                <ul className="space-y-1">
                  <li>• 17 x 24.8 CM</li>
                  <li>• 22.9 x 30.5 CM</li>
                  <li>• 27.9 x 35.6 CM</li>
                  <li>• A4 SIZE</li>
                  <li>• Custom sizes available upon request</li>
                </ul>
              </div>
              
              <p className="text-lg italic font-serif">"I paint all kind of stuffs"</p>
            </div>
          </div>
        </div>
        
        {/* Why Choose Me Section */}
        <div className="mt-24 reveal-on-scroll">
          <h3 className="text-3xl font-serif mb-8 text-center">Why Choose Me?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark-100 p-6 rounded-lg border border-charcoal-200">
              <h4 className="text-xl font-serif text-blood mb-4">Fast Delivery</h4>
              <p className="text-ghost/70">
                Receive your sketches within 24 hours for standard orders, with options for expedited delivery when you need it even faster.
              </p>
            </div>
            
            <div className="bg-dark-100 p-6 rounded-lg border border-charcoal-200">
              <h4 className="text-xl font-serif text-blood mb-4">Personalized Service</h4>
              <p className="text-ghost/70">
                Every project begins with understanding your vision and preferences. I work closely with you throughout the creative process.
              </p>
            </div>
            
            <div className="bg-dark-100 p-6 rounded-lg border border-charcoal-200">
              <h4 className="text-xl font-serif text-blood mb-4">Quality Guaranteed</h4>
              <p className="text-ghost/70">
                Not satisfied? I'll revise your artwork until you're completely happy with the results, ensuring each piece meets your expectations.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-10 right-0 w-40 h-40 rounded-full bg-blood/5 blur-3xl"></div>
      <div className="absolute top-20 -left-20 w-60 h-60 rounded-full bg-blood/5 blur-3xl"></div>
    </section>
  );
};

export default Services;
