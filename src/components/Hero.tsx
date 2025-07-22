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
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{height: '100vh'}}>
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/Design-SK.png"
            alt="Supermal Karawaci Interior"
            className="w-full h-full object-cover"
          />
          {/* Enhanced gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        </div>
        
        {/* Main Content Container - Hybrid Layout */}
        <div className="relative z-10 w-full h-full flex">
          
          {/* LEFT PART - Desktop: Exact Previous Iteration */}
          <div className="hidden md:flex flex-1 max-w-3xl px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 lg:py-8 flex-col justify-center">
            <div className="space-y-4 sm:space-y-6 md:space-y-8 pt-4 sm:pt-6 lg:pt-0">
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                  Welcome to <br/>
                  <span className="text-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">Supermal Karawaci</span>
                   <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed opacity-90">
                  Your Shopping, Culinary, & Entertainment Destination
                </p>
                </h1>
              </div>
              
              <div className="space-y-4 sm:space-y-6 mt-8 lg:mt-12">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">What's On</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl">
                  {whatsOnCards.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => openEventModal(event)}
                      className="relative bg-black/40 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer hover:bg-black/50 transition-all duration-300 transform hover:scale-105 group border border-white/10"
                    >
                      <div className="aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] relative">
                        <img 
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                        <div className="absolute top-3 left-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                          {event.category}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="text-white font-semibold text-sm mb-2 line-clamp-2">{event.title}</h4>
                        <p className="text-gray-300 text-xs opacity-75">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Only Layout */}
          <div className="block md:hidden w-full">
            <div className="px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-center relative z-20">
              <div className="space-y-3 sm:space-y-4">
                {/* Mobile Typography */}
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed opacity-90">
                    Your Shopping, Culinary, & Entertainment Destination
                  </p>
                  <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    Welcome to <br className="hidden sm:block"/> 
                    <span className="text-orange-400">Supermal Karawaci</span>
                  </h1>
                </div>

                {/* Mobile What's On Section */}
                <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white">What's On</h3>
                  
                  <div className="space-y-2">
                    {whatsOnCards.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => openEventModal(event)}
                        className="bg-black/40 backdrop-blur-sm rounded-lg p-3 cursor-pointer hover:bg-black/50 transition-all duration-300 border border-white/10"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full w-fit mb-1">
                              {event.category}
                            </div>
                            <h4 className="text-white font-semibold text-sm mb-1">{event.title}</h4>
                            <p className="text-gray-300 text-xs opacity-75">{event.date}</p>
                          </div>
                          <div className="text-orange-400">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Models */}
            <div className="relative h-64 sm:h-80 flex items-end justify-center mt-6">
              <img 
                src="https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/Model-2-Rev1.png"
                alt="Supermal Karawaci Models"
                className="object-contain object-bottom transition-transform duration-700 ease-out hover:scale-105"
                style={{
                  height: '100%',
                  width: 'auto',
                  transformOrigin: 'bottom center',
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT PART - Desktop: Exact Previous Iteration */}
        <div className="absolute right-0 bottom-0 w-3/5 h-full hidden lg:block overflow-visible">
          <div className="relative w-full h-full flex items-end justify-end">
            <img 
              src="https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/Model-2-Rev1.png"
              alt="Supermal Karawaci Models"
              className="object-contain object-bottom transition-transform duration-700 ease-out hover:scale-105 lg:translate-x-16 xl:translate-x-20 2xl:translate-x-24"
              style={{
                height: '100%',
                width: 'auto',
                transformOrigin: 'bottom center',
                maxWidth: 'none',
                maxHeight: '100%'
              }}
            />
          </div>
        </div>
        
        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="w-6 h-10 border-2 border-orange-400/60 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-orange-400/80 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Event Modal - Enhanced */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
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
                <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                  {selectedEvent.category}
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{selectedEvent.title}</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3 text-orange-500" />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3 text-orange-500" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-orange-500" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">{selectedEvent.description}</p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                    Learn More
                  </button>
                  <button className="flex-1 py-3 bg-orange-400 text-white rounded-lg font-semibold hover:bg-orange-500 transition-colors">
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