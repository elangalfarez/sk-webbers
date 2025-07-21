import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const Events = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const events = [
    {
      id: 1,
      title: "Baba Lili Tata Beach Party",
      date: "12 June - 13 Jul 2025",
      time: "10:00 AM - 10:00 PM",
      location: "Ground Floor, Grand Atrium",
      description: "Baba Lili Tata 1st Live Show in Jabodetabek",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/WhatsApp-Image-2025-06-28-at-15.10.14_4261ce1f-scaled.jpg",
      category: "Kids"
    },
    {
      id: 2,
      title: "Gramedia Back to School",
      date: "17 June - 13 July 2025",
      time: "10:00 AM - 10:00 PM",
      location: "Upper Ground, Kids Atrium",
      description: "Buy stationeries, books, and back to school supplies for your kids",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/WhatsApp-Image-2025-06-17-at-16.11.23_8471f426-scaled.jpg",
      category: "Kids"
    },
    {
      id: 3,
      title: "Gramedia Big Sale",
      date: "1 - 27 July 2025",
      time: "10:00 AM - 10:00 PM",
      location: "First Floor, East Dome",
      description: "Stationery and book supplies at 70% discount",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-02-at-14.42.40_d70e7702-scaled.jpg",
      category: "Family"
    },
    {
      id: 4,
      title: "Pets Nation Festival Vol. 2",
      date: "1 - 27 July 2025",
      time: "10:00 AM - 10:00 PM",
      location: "First Floor, East Dome",
      description: "Pet lovers festival with adoption drives and pet care workshops",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-02-at-14.42.40_d70e7702-scaled.jpg",
      category: "Family"
    },
    {
      id: 5,
      title: "Fashion Week Showcase",
      date: "15 - 30 August 2025",
      time: "2:00 PM - 9:00 PM",
      location: "Second Floor, Fashion Gallery",
      description: "Latest fashion trends and designer collections showcase",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Fashion"
    },
    {
      id: 6,
      title: "Food Festival Extravaganza",
      date: "5 - 20 September 2025",
      time: "11:00 AM - 11:00 PM",
      location: "Ground Floor, Central Court",
      description: "Culinary journey featuring local and international cuisines",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Food"
    }
  ];

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(events.length / itemsPerSlide);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const getCurrentEvents = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return events.slice(startIndex, startIndex + itemsPerSlide);
  };

  return (
    <section className="py-12 md:py-20 bg-light-gray overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Current <span className="text-gold">Events</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Don't miss out on our exciting events and exclusive promotions
          </p>
        </div>
        
        {/* Slider Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Events Grid with Parallax */}
          <div className="relative overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ 
                transform: `translateX(-${currentSlide * 100}%)`,
                width: `${totalSlides * 100}%`
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div 
                  key={slideIndex}
                  className="w-full flex-shrink-0 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                  style={{ width: `${100 / totalSlides}%` }}
                >
                  {events.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((event, index) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group flex flex-col h-full"
                      style={{
                        transform: `translateY(${Math.sin((slideIndex * itemsPerSlide + index) * 0.5) * 10}px)`,
                        transition: 'transform 0.7s ease-in-out'
                      }}
                    >
                      <div className="relative overflow-hidden">
                        <img 
                          src={event.image}
                          alt={event.title}
                          className="w-full h-40 md:h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4 bg-gold text-primary px-3 py-1 rounded-full text-sm font-semibold">
                          {event.category}
                        </div>
                        {/* Parallax overlay */}
                        <div 
                          className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:bg-black/10"
                          style={{
                            transform: `translateY(${currentSlide * -5}px)`,
                            transition: 'transform 0.7s ease-in-out'
                          }}
                        />
                      </div>
                      
                      <div className="p-4 md:p-6 flex flex-col flex-grow">
                        <h3 className="text-lg md:text-xl font-bold text-primary mb-3 group-hover:text-gold transition-colors duration-300">
                          {event.title}
                        </h3>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-gold" />
                            <span className="text-sm">{event.date}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2 text-gold" />
                            <span className="text-sm">{event.time}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-gold" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed flex-grow">{event.description}</p>
                        
                        <div className="mt-auto">
                          <button className="w-full flex items-center justify-center py-3 bg-primary border border-gold text-white rounded-lg font-semibold hover:bg-dark-gray hover:shadow-lg transition-all duration-300 group">
                            Learn More
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary/90 backdrop-blur-sm border border-gold text-white rounded-full flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300 shadow-lg z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary/90 backdrop-blur-sm border border-gold text-white rounded-full flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300 shadow-lg z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-gold scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-gold transition-all duration-300 ease-linear"
              style={{ 
                width: `${((currentSlide + 1) / totalSlides) * 100}%`,
                transition: isAutoPlaying ? 'width 4s linear' : 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Event Counter */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Showing {currentSlide * itemsPerSlide + 1}-{Math.min((currentSlide + 1) * itemsPerSlide, events.length)} of {events.length} events
          </p>
        </div>
      </div>
    </section>
  );
};

export default Events;