import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

const Events = () => {
  const events = [
    {
      id: 1,
      title: "Baba Lili Tata Beach Party",
      date: "12 June - 13 Jul 2025",
      time: "10:00 AM - 10:00 PM",
      location: "Ground Floor Atrium",
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
      date: "July 2025",
      time: "10:00 AM - 10:00 PM",
      location: "First Floor, East Dome",
      description: "Stationery and book supplies at 70% discount",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-02-at-14.42.40_d70e7702-scaled.jpg",
      category: "Family"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ongoing <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Events</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't miss out on our exciting events and exclusive promotions
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group flex flex-col h-full"
            >
              <div className="relative">
                <img 
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {event.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{event.description}</p>
                
                <div className="mt-auto">
                  <button className="w-full flex items-center justify-center py-3 gradient-card text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 group">
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