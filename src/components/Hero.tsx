import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, X, Calendar, Clock, MapPin } from 'lucide-react';

const Hero = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [currentDesktopSlide, setCurrentDesktopSlide] = useState(0);
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  
  const desktopSliderRef = useRef<HTMLDivElement>(null);
  const mobileSliderRef = useRef<HTMLDivElement>(null);
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);

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
    },
    {
      id: 4,
      title: "Summer Fashion Week",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/WhatsApp-Image-2025-06-28-at-15.10.14_4261ce1f-scaled.jpg",
      date: "15 - 30 July 2025",
      time: "11:00 AM - 9:00 PM",
      location: "Second Floor, Fashion District",
      description: "Discover the latest summer fashion trends with exclusive collections from top brands and local designers.",
      category: "Fashion"
    },
    {
      id: 5,
      title: "Food Festival",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-02-at-14.42.40_d70e7702-scaled.jpg",
      date: "20 - 25 July 2025",
      time: "12:00 PM - 10:00 PM",
      location: "Food Court Area",
      description: "Taste the best culinary delights from around the world with special prices and new menu launches.",
      category: "Culinary"
    }
  ];

  // Calculate maximum slides for proper pagination
  const desktopVisibleCards = 3;
  const mobileVisibleCards = 2;
  const maxDesktopSlides = Math.max(1, whatsOnCards.length - desktopVisibleCards + 1);
  const maxMobileSlides = Math.max(1, whatsOnCards.length - mobileVisibleCards + 1);

  // Auto-slide functionality with proper wrapping
  useEffect(() => {
    if (!isDragging) {
      const interval = setInterval(() => {
        setCurrentDesktopSlide(prev => (prev + 1) % maxDesktopSlides);
        setCurrentMobileSlide(prev => (prev + 1) % maxMobileSlides);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [maxDesktopSlides, maxMobileSlides, isDragging]);

  const openEventModal = (event: any) => {
    setSelectedEvent(event);
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
  };

  // Get consecutive cards starting from index with wrapping
  const getVisibleCards = (startIndex: number, count: number) => {
    const cards = [];
    for (let i = 0; i < count; i++) {
      const index = (startIndex + i) % whatsOnCards.length;
      cards.push(whatsOnCards[index]);
    }
    return cards;
  };

  // Desktop drag handlers
  const handleDesktopMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setDragOffset(0);
    if (desktopSliderRef.current) {
      desktopSliderRef.current.style.transition = 'none';
    }
  };

  const handleDesktopMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !desktopContainerRef.current) return;
    
    const deltaX = e.clientX - startX;
    setDragOffset(deltaX);
    
    if (desktopSliderRef.current) {
      const translateX = -currentDesktopSlide * (100 / maxDesktopSlides) + (deltaX / desktopContainerRef.current.offsetWidth) * (100 / maxDesktopSlides);
      desktopSliderRef.current.style.transform = `translateX(${translateX}%)`;
    }
  };

  const handleDesktopMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (desktopSliderRef.current) {
      desktopSliderRef.current.style.transition = 'transform 0.5s ease-out';
    }
    
    // Determine if we should move to next/prev slide
    const threshold = 50;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        // Dragging right (previous slide)
        setCurrentDesktopSlide(prev => prev === 0 ? maxDesktopSlides - 1 : prev - 1);
      } else {
        // Dragging left (next slide)
        setCurrentDesktopSlide(prev => (prev + 1) % maxDesktopSlides);
      }
    }
    
    setDragOffset(0);
  };

  // Mobile drag handlers
  const handleMobileTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setDragOffset(0);
    if (mobileSliderRef.current) {
      mobileSliderRef.current.style.transition = 'none';
    }
  };

  const handleMobileTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !mobileContainerRef.current) return;
    
    const deltaX = e.touches[0].clientX - startX;
    setDragOffset(deltaX);
    
    if (mobileSliderRef.current) {
      const translateX = -currentMobileSlide * (100 / maxMobileSlides) + (deltaX / mobileContainerRef.current.offsetWidth) * (100 / maxMobileSlides);
      mobileSliderRef.current.style.transform = `translateX(${translateX}%)`;
    }
  };

  const handleMobileTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (mobileSliderRef.current) {
      mobileSliderRef.current.style.transition = 'transform 0.5s ease-out';
    }
    
    // Determine if we should move to next/prev slide
    const threshold = 30;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        // Swiping right (previous slide)
        setCurrentMobileSlide(prev => prev === 0 ? maxMobileSlides - 1 : prev - 1);
      } else {
        // Swiping left (next slide)
        setCurrentMobileSlide(prev => (prev + 1) % maxMobileSlides);
      }
    }
    
    setDragOffset(0);
  };

  // Update transforms
  useEffect(() => {
    if (desktopSliderRef.current && !isDragging) {
      desktopSliderRef.current.style.transform = `translateX(-${currentDesktopSlide * (100 / maxDesktopSlides)}%)`;
    }
  }, [currentDesktopSlide, maxDesktopSlides, isDragging]);

  useEffect(() => {
    if (mobileSliderRef.current && !isDragging) {
      mobileSliderRef.current.style.transform = `translateX(-${currentMobileSlide * (100 / maxMobileSlides)}%)`;
    }
  }, [currentMobileSlide, maxMobileSlides, isDragging]);

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{height: '100vh', minHeight: '100vh'}}>
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
        <div className="relative z-10 w-full h-full">
          
          {/* DESKTOP LAYOUT */}
          <div className="hidden md:block h-full">
            {/* Title and Subtitle - Higher Position */}
            <div className="absolute top-1/3 left-4 sm:left-6 lg:left-8 xl:left-12 transform -translate-y-1/2 max-w-2xl z-20">
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight outfit-title">
                  Welcome to <br/>
                  <span className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">Supermal Karawaci</span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed opacity-90">
                  Your Shopping, Culinary, & Entertainment Destination
                </p>
              </div>
            </div>

            {/* What's On Section - Bottom Left */}
            <div className="absolute bottom-8 left-4 sm:left-6 lg:left-8 xl:left-12 max-w-4xl z-20">
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">What's On</h3>
                
                {/* Desktop Drag Slider Container */}
                <div className="relative">
                  <div 
                    ref={desktopContainerRef}
                    className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={handleDesktopMouseDown}
                    onMouseMove={handleDesktopMouseMove}
                    onMouseUp={handleDesktopMouseUp}
                    onMouseLeave={handleDesktopMouseUp}
                  >
                    <div 
                      ref={desktopSliderRef}
                      className="flex transition-transform duration-500 ease-out"
                      style={{ 
                        transform: `translateX(-${currentDesktopSlide * (100 / maxDesktopSlides)}%)`,
                        width: `${maxDesktopSlides * 100}%`
                      }}
                    >
                      {Array.from({ length: maxDesktopSlides }).map((_, slideIndex) => (
                        <div
                          key={slideIndex}
                          className="flex-none"
                          style={{ width: `${100 / maxDesktopSlides}%` }}
                        >
                          <div className="flex space-x-3 px-1">
                            {getVisibleCards(slideIndex, desktopVisibleCards).map((event, cardIndex) => (
                              <div
                                key={`${event.id}-${slideIndex}-${cardIndex}`}
                                onClick={() => !isDragging && openEventModal(event)}
                                className="relative bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer hover:bg-black/50 transition-all duration-300 transform hover:scale-105 group border border-white/10 w-60"
                              >
                                <div className="aspect-[4/3] relative">
                                  <img 
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                    draggable={false}
                                  />
                                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                                  <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                                    {event.category}
                                  </div>
                                </div>
                                <div className="p-5">
                                  <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">{event.title}</h4>
                                  <p className="text-gray-300 text-xs opacity-75">{event.date}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Pagination Dots */}
                  <div className="flex justify-center mt-2 space-x-2">
                    {Array.from({ length: maxDesktopSlides }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentDesktopSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentDesktopSlide 
                            ? 'bg-yellow-400 w-6' 
                            : 'bg-white/30 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE LAYOUT */}
          <div className="block md:hidden h-full">
            {/* Title, Subtitle and What's On Section - Repositioned */}
            <div className="absolute top-24 left-4 right-4 z-20">
              <div className="space-y-4 sm:space-y-6">
                {/* Title and Subtitle */}
                <div className="space-y-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight outfit-title">
                    Welcome to <br/> 
                    <span className="text-gold">Supermal Karawaci</span>
                  </h1>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed opacity-90">
                    Your Shopping, Culinary, & Entertainment Destination
                  </p>
                </div>

                {/* What's On Section - Now positioned after subtitle */}
                <div className="space-y-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">What's On</h3>
                  
                  {/* Mobile Touch Slider - Improved responsiveness */}
                  <div className="relative">
                    <div 
                      ref={mobileContainerRef}
                      className="overflow-hidden select-none"
                      onTouchStart={handleMobileTouchStart}
                      onTouchMove={handleMobileTouchMove}
                      onTouchEnd={handleMobileTouchEnd}
                    >
                      <div 
                        ref={mobileSliderRef}
                        className="flex transition-transform duration-500 ease-out"
                        style={{ 
                          transform: `translateX(-${currentMobileSlide * (100 / maxMobileSlides)}%)`,
                          width: `${maxMobileSlides * 100}%`
                        }}
                      >
                        {Array.from({ length: maxMobileSlides }).map((_, slideIndex) => (
                          <div
                            key={slideIndex}
                            className="flex-none"
                            style={{ width: `${100 / maxMobileSlides}%` }}
                          >
                            <div className="flex space-x-2 px-1">
                              {getVisibleCards(slideIndex, mobileVisibleCards).map((event, cardIndex) => (
                                <div
                                  key={`mobile-${event.id}-${slideIndex}-${cardIndex}`}
                                  onClick={() => !isDragging && openEventModal(event)}
                                  className="flex-1 bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden cursor-pointer hover:bg-black/50 transition-all duration-300 border border-white/10 min-w-0"
                                >
                                  {/* Card Image */}
                                  <div className="aspect-[4/3] relative">
                                    <img 
                                      src={event.image}
                                      alt={event.title}
                                      className="w-full h-full object-cover"
                                      draggable={false}
                                    />
                                    <div className="absolute inset-0 bg-black/30"></div>
                                    <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                                      {event.category}
                                    </div>
                                  </div>
                                  
                                  {/* Card Content */}
                                  <div className="p-3">
                                    <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">{event.title}</h4>
                                    <p className="text-gray-300 text-xs opacity-75">{event.date}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Mobile Pagination - Improved spacing */}
                    <div className="flex justify-center mt-3 space-x-2">
                      {Array.from({ length: maxMobileSlides }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentMobileSlide(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentMobileSlide 
                              ? 'bg-yellow-400 w-4' 
                              : 'bg-white/30 hover:bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Models - Adjusted position to accommodate cards */}
            <div className="absolute bottom-0 left-0 right-0 h-96 sm:h-112 flex items-end justify-center">
              <img 
                src="https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/Model-2-Rev1.png"
                alt="Supermal Karawaci Models"
                className="object-contain object-bottom transition-transform duration-700 ease-out hover:scale-105 max-w-full opacity-80"
                style={{
                  height: '100%',
                  width: 'auto',
                  transformOrigin: 'bottom center'
                }}
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* RIGHT PART - Desktop: Models */}
        <div className="absolute right-0 bottom-0 w-2/5 lg:w-1/2 xl:w-3/5 h-full hidden lg:block overflow-visible">
          <div className="relative w-full h-full flex items-end justify-end">
            <img 
              src="https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/Model-2-Rev1.png"
              alt="Supermal Karawaci Models"
              className="object-contain object-bottom transition-transform duration-700 ease-out hover:scale-105 active:scale-110 cursor-pointer lg:translate-x-16 xl:translate-x-20 2xl:translate-x-24"
              style={{
                height: '100%',
                width: 'auto',
                transformOrigin: 'bottom center',
                maxWidth: 'none',
                maxHeight: '100%'
              }}
              onClick={(e) => {
                // Add click animation effect
                const target = e.currentTarget as HTMLElement;
                target.style.transform = 'scale(1.1) translateX(16px)';
                setTimeout(() => {
                  target.style.transform = '';
                }, 300);
              }}
              draggable={false}
            />
          </div>
        </div>
        
        {/* Enhanced Scroll Indicator - Centered */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="w-6 h-10 border-2 border-gold/60 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold/80 rounded-full mt-2 animate-bounce"></div>
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
                  <button className="flex-1 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                    Learn More
                  </button>
                  <button className="flex-1 py-3 bg-gold text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style>{`
        .text-gold {
          color: #fbbf24;
        }
        
        .bg-gold {
          background-color: #fbbf24;
        }
        
        .border-gold\/60 {
          border-color: rgba(251, 191, 36, 0.6);
        }
        
        .bg-gold\/80 {
          background-color: rgba(251, 191, 36, 0.8);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .cursor-grab {
          cursor: grab;
        }

        .cursor-grabbing,
        .active\\:cursor-grabbing:active {
          cursor: grabbing;
        }

        .select-none {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
      `}</style>
    </>
  );
};

export default Hero;