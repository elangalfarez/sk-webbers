import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

const Events = () => {
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
    }
    {
      id: 4,
      title: "Pets Nation Festival Vol. 2",
      date: "1 - 27 July 2025",
      time: "10:00 AM - 10:00 PM",
      location: "First Floor, East Dome",
      description: "Stationery and book supplies at 70% discount",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-02-at-14.42.40_d70e7702-scaled.jpg",
      category: "Family"
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Current <span className="text-gold">Events</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Don't miss out on our exciting events and exclusive promotions
          </p>
        </div>
        
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group flex flex-col h-full"
            >
              <div className="relative">
                <img 
                  src={event.image}
                  alt={event.title}
                  className="w-full h-40 md:h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-gold text-primary px-3 py-1 rounded-full text-sm font-semibold">
                  {event.category}
                </div>
              </div>
              
              <div className="p-4 md:p-6 flex flex-col flex-grow">
                <h3 className="text-lg md:text-xl font-bold text-primary mb-3">{event.title}</h3>
                
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
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{event.description}</p>
                
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
      </div>
    </section>
  );
};

export default Events;