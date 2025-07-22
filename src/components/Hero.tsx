import React, { useState } from 'react';
import { ChevronRight, X, Calendar, Clock, MapPin } from 'lucide-react';

const Hero = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const whatsOnCards = [
    {
      id: 1,
      title: "Baba Lili Tata Beach Party",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/WhatsApp-Image-2025-06-28-at-15.10.14_4261ce1f-scaled.jpg",
      date: "12 June - 13 Jul 2025",
      time: "10:00 AM - 10:00 PM",
      location: "Ground Floor, Grand Atrium",
      description: "Baba Lili Tata 1st Live Show in Jabodetabek. Join us for an exciting beach-themed party with live performances, games, and entertainment for the whole family.",
      category: "Kids Entertainment"
    },
    {
      id: 2,
      title: "Gramedia Back to School",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/WhatsApp-Image-2025-06-17-at-16.11.23_8471f426-scaled.jpg",
      date: "17 June - 13 July 2025",
      time: "10:00 AM - 10:00 PM",
      location: "Upper Ground, Kids Atrium",
      description: "Get ready for the new school year with our comprehensive back-to-school collection. Find everything from stationeries, books, and school supplies for your kids.",
      category: "Shopping"
    },
    {
      id: 3,
      title: "Gramedia Big Sale",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-02-at-14.42.40_d70e7702-scaled.jpg",
      date: "1 - 27 July 2025",
      time: "10:00 AM - 10:00 PM",
      location: "First Floor, East Dome",
      description: "Don't miss our biggest sale of the year! Get up to 70% discount on stationery and book supplies. Perfect time to stock up on your favorite items.",
      category: "Sale"
    }
  ];

  const openEventModal = (event: any) => {
    setSelectedEvent(event);
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16 md:pt-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/Design-SK.png"
            alt="Supermal Karawaci Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Main Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start lg:items-center min-h-[calc(100vh-8rem)] lg:min-h-[80vh]">
            
            {/* Left Content */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 pt-4 sm:pt-6 lg:pt-0">
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mt-4 sm:mt-6 md:mt-8 lg:mt-12">
                  Welcome to <br/> 
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">Supermal Karawaci</span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-lg">
                  Your Shopping, Culinary, & Entertainment Destination
                </p>
              </div>

              {/* What's On Preview Cards */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">What's On</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4">
                  {whatsOnCards.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => openEventModal(event)}
                      className="relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group"
                    >
                      <div className="aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] relative">
                        <img 
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gold text-primary px-2 py-1 rounded-full text-xs font-semibold">
                          {event.category}
                        </div>
                      </div>
                      <div className="p-3 sm:p-4">
                        <h4 className="text-white font-semibold text-xs sm:text-sm mb-2 line-clamp-2">{event.title}</h4>
                        <p className="text-gray-300 text-xs">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content - Models Image - Fixed positioning */}
            <div className="relative hidden lg:flex justify-end items-end h-full">
              <div className="relative flex items-end justify-end w-full h-full">
                <img 
                  src="https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/Model-2-Rev1.png"
                  alt="Supermal Karawaci Models"
                  className="w-full max-w-sm xl:max-w-lg h-auto object-contain object-bottom"
                  style={{
                    maxHeight: 'calc(100vh - 12rem)',
                    minHeight: '400px'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-2 sm:bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gold rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeEventModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Modal Content */}
            <div className="relative">
              <div className="aspect-[16/9] relative">
                <img 
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
                <div className="absolute inset-0 bg-black/40 rounded-t-2xl"></div>
                <div className="absolute top-4 left-4 bg-gold text-primary px-3 py-1 rounded-full text-sm font-semibold">
                  {selectedEvent.category}
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">{selectedEvent.title}</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3 text-gold" />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3 text-gold" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-gold" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">{selectedEvent.description}</p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 py-3 bg-primary border border-gold text-white rounded-lg font-semibold hover:bg-dark-gray transition-colors">
                    Learn More
                  </button>
                  <button className="flex-1 py-3 bg-gold text-primary rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;