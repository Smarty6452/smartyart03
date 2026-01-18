
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Artwork {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

const artworks: Artwork[] = [
  {
    id: 1,
    title: "Fading Memories",
    description: "An exploration of how our memories fade and distort over time.",
    image: "/smartyart-uploads/043b4494-8cb6-4982-a5f3-c740556fa81f.png",
    category: "portrait"
  },
  {
    id: 2,
    title: "Weathered Wisdom",
    description: "The lines of age hold stories untold, experiences that shape perception.",
    image: "/smartyart-uploads/82e66eb7-cd72-47f6-9541-5c8003a7c36e.png",
    category: "portrait"
  },
  {
    id: 3,
    title: "Winter's Embrace",
    description: "Finding warmth in the coldest season speaks to our internal resilience.",
    image: "/smartyart-uploads/be52b837-c266-40dc-b19a-dcff8eb56fe4.png",
    category: "portrait"
  },
  {
    id: 4,
    title: "Graphite Essence",
    description: "Capturing the soul through simple strokes, revealing character in shadows.",
    image: "/smartyart-uploads/6b912837-36fd-4b24-89af-a6a5eba6739f.png",
    category: "sketch"
  },
  {
    id: 5,
    title: "Creative Process",
    description: "Behind every creation lies hours of dedication, tools, and inspiration.",
    image: "/smartyart-uploads/9148ee61-33d9-462d-a6f0-91f8359dc515.png",
    category: "workspace"
  },
  {
    id: 6,
    title: "Fragmented Identity",
    description: "The darkness within us all, cracks that reveal our true nature.",
    image: "/smartyart-uploads/22bd7b51-f865-4cdd-a3a3-6b1d882bc850.png",
    category: "horror"
  },
  {
    id: 7,
    title: "Enchanting Gaze",
    description: "Magical portrait with striking cyan eyes that captivate the viewer.",
    image: "/smartyart-uploads/e7d8354e-0656-418c-a088-017e5155c677.png",
    category: "fantasy"
  },
  {
    id: 8,
    title: "The Boy Who Lived",
    description: "Detailed graphite portrait capturing the essence of a beloved character.",
    image: "/smartyart-uploads/b488c01d-72bf-4ad3-ba51-dd3dacecb668.png",
    category: "portrait"
  },
  {
    id: 9,
    title: "Tender Moments",
    description: "A gentle portrait of a girl with her feline companion, capturing innocence.",
    image: "/smartyart-uploads/1fc18592-1feb-4fa2-b18b-45f53b563301.png",
    category: "portrait"
  },
  {
    id: 10,
    title: "Cultural Essence",
    description: "A striking portrait capturing heritage and tradition with meticulous detail.",
    image: "/smartyart-uploads/5602736b-79e0-4646-b069-ad2731baee9c.png",
    category: "portrait"
  },
  {
    id: 11,
    title: "Elegant Confidence",
    description: "Strong character portrayed through careful linework and shading technique.",
    image: "/smartyart-uploads/1461a27e-4fd9-41ac-b960-7c8f2ef9cb1a.png", 
    category: "portrait"
  },
  {
    id: 12,
    title: "Friendship Portrait",
    description: "Capturing genuine connection between friends through detailed pencil work.",
    image: "/smartyart-uploads/9ab97be8-a004-46d2-9994-b69681062481.png",
    category: "portrait"
  },
  {
    id: 13,
    title: "Modern Companions",
    description: "Contemporary portrait showcasing the bond of friendship in modern times.",
    image: "/smartyart-uploads/72aa9fc0-ad75-4ed4-b913-b6cfa1660394.png",
    category: "portrait"
  },
  {
    id: 14,
    title: "Traditional Beauty",
    description: "A portrait highlighting cultural attire and traditional feminine beauty.",
    image: "/smartyart-uploads/69f1f65b-75c3-4635-a731-90dace960004.png",
    category: "portrait"
  },
  {
    id: 15,
    title: "Graceful Pose",
    description: "Elegant portrait capturing the gentle expression of a young woman.",
    image: "/smartyart-uploads/343b99f3-4d5d-4a8c-a23e-91e9a3ba9e2d.png",
    category: "portrait"
  }
];

const Gallery = () => {
  const [filter, setFilter] = useState<string>("all");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.reveal-on-scroll').forEach(elem => {
      observer.observe(elem);
    });

    return () => {
      document.querySelectorAll('.reveal-on-scroll').forEach(elem => {
        observer.unobserve(elem);
      });
    };
  }, [filter]);

  const filteredArtworks = filter === "all" 
    ? artworks 
    : artworks.filter(artwork => artwork.category === filter);

  return (
    <section id="gallery" className="py-24 relative">
      <div className="container">
        <h2 className="text-4xl md:text-5xl font-serif mb-4 text-center reveal-on-scroll">The Gallery</h2>
        <p className="text-ghost/70 text-center max-w-xl mx-auto mb-12 reveal-on-scroll">
          Explore my diverse collection of portraits, character sketches, and digital art. Each piece reflects my passion for capturing emotion and personality through careful attention to detail.
        </p>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 reveal-on-scroll">
          {["all", "portrait", "fantasy", "sketch", "workspace"].map((category) => (
            <button
              key={category}
              className={cn(
                "px-4 py-2 rounded-md transition-all",
                filter === category 
                  ? "bg-blood text-ghost" 
                  : "bg-dark-100 text-ghost/70 hover:bg-charcoal-200"
              )}
              onClick={() => setFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Featured Artwork Carousel */}
        <div className="mb-16 reveal-on-scroll">
          <h3 className="text-2xl font-serif mb-6 text-center">Featured Works</h3>
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {filteredArtworks.slice(0, 5).map((artwork) => (
                <CarouselItem key={artwork.id} className="md:basis-1/2 lg:basis-1/3">
                  <div 
                    className="artwork-card mx-2 cursor-pointer"
                    onClick={() => setSelectedArtwork(artwork)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img 
                        src={artwork.image} 
                        alt={artwork.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-300 to-transparent opacity-60"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="text-lg font-serif text-ghost">{artwork.title}</h4>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </Carousel>
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredArtworks.map((artwork, index) => (
            <div 
              key={artwork.id}
              className="artwork-card reveal-on-scroll cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedArtwork(artwork)}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img 
                  src={artwork.image} 
                  alt={artwork.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-300 to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-serif text-ghost">{artwork.title}</h3>
                  <p className="text-sm text-ghost/70">{artwork.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Modal for Selected Artwork */}
      {selectedArtwork && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedArtwork(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-dark-100 p-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-ghost hover:text-blood"
              onClick={() => setSelectedArtwork(null)}
            >
              <X size={24} />
            </button>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <img 
                  src={selectedArtwork.image} 
                  alt={selectedArtwork.title}
                  className="w-full h-auto"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-2xl font-serif mb-2">{selectedArtwork.title}</h3>
                <p className="text-ghost/70 mb-4">{selectedArtwork.description}</p>
                <div className="bg-charcoal-200 p-3 rounded-md">
                  <p className="text-sm italic text-ghost/60">
                    Every piece tells a story, and this one speaks of {selectedArtwork.category === "horror" ? "the darkness that lurks within us all" : "the beauty found in imperfection"}. Created using traditional techniques combined with digital enhancements to capture the essence of emotion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
