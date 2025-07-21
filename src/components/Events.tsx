import React from 'react';
import { EventsCarousel } from '@/components/ui/carousel';
import type { CarouselItem } from '@/components/ui/carousel';

const Events = () => {
  const events: CarouselItem[] = [
    {
      id: 1,
      title: "Baba Lili Tata Beach Party",
      date: "12 June - 13 Jul 2025",
      time: "10:00 AM - 10:00 PM",
      location: "Ground Floor, Grand Atrium",
      description: "Baba Lili Tata 1st Live Show in Jabodetabek. Join us for an exciting beach-themed party with live performances, games, and entertainment for the whole family.",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/WhatsApp-Image-2025-06-28-at-15.10.14_4261ce1f-scaled.jpg",
      category: "Kids"
    },
    {
      id: 2,
      title: "Gramedia Back to School",
      date: "17 June - 13 July 2025",
      time: "10:00 AM - 10:00 PM",
      location: "Upper Ground, Kids Atrium",
      description: "Get ready for the new school year with our comprehensive back-to-school collection. Find everything from stationeries, books, and school supplies for your kids.",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/WhatsApp-Image-2025-06-17-at-16.11.23_8471f426-scaled.jpg",
      category: "Shopping"
    },
    {
      id: 3,
      title: "Gramedia Big Sale",
      date: "1 - 27 July 2025",
      time: "10:00 AM - 10:00 PM",
      location: "First Floor, East Dome",
      description: "Don't miss our biggest sale of the year! Get up to 70% discount on stationery and book supplies. Perfect time to stock up on your favorite items.",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-02-at-14.42.40_d70e7702-scaled.jpg",
      category: "Sale"
    },
    {
      id: 4,
      title: "Pets Nation Festival Vol. 2",
      date: "1 - 27 July 2025",
      time: "10:00 AM - 10:00 PM",
      location: "First Floor, East Dome",
      description: "Pet lovers festival with adoption drives, pet care workshops, and fun activities for you and your furry friends.",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Family"
    },
    {
      id: 5,
      title: "Fashion Week Showcase",
      date: "15 - 30 August 2025",
      time: "2:00 PM - 9:00 PM",
      location: "Second Floor, Fashion Gallery",
      description: "Latest fashion trends and designer collections showcase featuring local and international brands.",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Fashion"
    },
    {
      id: 6,
      title: "Food Festival Extravaganza",
      date: "5 - 20 September 2025",
      time: "11:00 AM - 11:00 PM",
      location: "Ground Floor, Central Court",
      description: "Culinary journey featuring local and international cuisines with special chef demonstrations and tastings.",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Food"
    },
    {
      id: 7,
      title: "Tech Innovation Expo",
      date: "10 - 25 October 2025",
      time: "10:00 AM - 8:00 PM",
      location: "Third Floor, Tech Hub",
      description: "Discover the latest in technology and innovation with interactive displays and product launches.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Technology"
    },
    {
      id: 8,
      title: "Art & Culture Festival",
      date: "1 - 15 November 2025",
      time: "9:00 AM - 9:00 PM",
      location: "Ground Floor, Cultural Center",
      description: "Celebrate Indonesian art and culture with exhibitions, performances, and workshops by local artists.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Culture"
    }
  ];

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
        
        {/* Infinite Carousel */}
        <div className="flex justify-center">
          <EventsCarousel
            items={events}
            baseWidth={400}
            autoplay={true}
            autoplayDelay={4000}
            pauseOnHover={true}
            loop={true}
            round={false}
          />
        </div>
        
        {/* Event Counter */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            {events.length} exciting events happening at Supermal Karawaci
          </p>
        </div>
      </div>
    </section>
  );
};

export default Events;