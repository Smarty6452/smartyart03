
import React, { useState } from 'react';
import { Send, Mail, MapPin, Instagram } from 'lucide-react';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Your message has been sent. Expect a response soon!');
      
      // Redirect to email
      window.open(`mailto:smartyart03@gmail.com?subject=Commission Request: ${formState.name}&body=${formState.message}%0A%0AFrom: ${formState.name}%0AEmail: ${formState.email}`);
      
      // Reset form
      setFormState({
        name: '',
        email: '',
        message: ''
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitMessage(null);
      }, 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-center reveal-on-scroll">Get In Touch</h2>
          <p className="text-ghost/70 text-center max-w-xl mx-auto mb-12 reveal-on-scroll">
            Interested in commissioning artwork? Have questions about my services or pricing? Feel free to reach out and I'll get back to you soon.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="reveal-on-scroll">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-ghost mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark-100 border border-charcoal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blood/50 text-ghost"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-ghost mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark-100 border border-charcoal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blood/50 text-ghost"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-ghost mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 bg-dark-100 border border-charcoal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blood/50 text-ghost"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blood hover:bg-blood/80 transition-colors text-ghost rounded-md"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-l-2 border-ghost"></span>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
                
                {submitMessage && (
                  <div className="bg-charcoal-200 p-4 rounded-md text-center animate-fade-in">
                    <p className="text-ghost">{submitMessage}</p>
                  </div>
                )}
              </form>
            </div>
            
            <div className="reveal-on-scroll">
              <div className="p-6 bg-dark-100 border border-charcoal-200 rounded-md relative overflow-hidden">
                <h3 className="text-xl font-serif mb-6">Connect With Rohit</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-charcoal-200 flex items-center justify-center">
                      <Mail size={18} className="text-blood" />
                    </div>
                    <a href="mailto:smartyart03@gmail.com" className="text-ghost/70 hover:text-blood transition-colors">smartyart03@gmail.com</a>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-charcoal-200 flex items-center justify-center">
                      <MapPin size={18} className="text-blood" />
                    </div>
                    <span className="text-ghost/70">Fairway, Kitchener, ON</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-charcoal-200 flex items-center justify-center">
                      <Instagram size={18} className="text-blood" />
                    </div>
                    <a href="https://instagram.com/smartyart03" target="_blank" rel="noopener noreferrer" className="text-ghost/70 hover:text-blood transition-colors">@smartyart03</a>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-charcoal-200">
                    <p className="text-ghost/70">Phone: +1 (742) 999 0414</p>
                    <p className="text-ghost/70 mt-2">Available for freelance projects and collaborations</p>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-blood/5 blur-xl"></div>
                <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-blood/5 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
