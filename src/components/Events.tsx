import React from 'react';
import { CardCarousel } from '@/components/ui/card-carousel';

const Events = () => {
  const eventImages = [
    {
      src: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/WhatsApp-Image-2025-06-28-at-15.10.14_4261ce1f-scaled.jpg",
      alt: "Baba Lili Tata Beach Party"
    },
    {
      src: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/WhatsApp-Image-2025-06-17-at-16.11.23_8471f426-scaled.jpg",
      alt: "Gramedia Back to School"
    },
    {
      src: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-02-at-14.42.40_d70e7702-scaled.jpg",
      alt: "Gramedia Big Sale"
    },
    {
      src: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Pets Nation Festival Vol. 2"
    },
    {
      src: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Fashion Week Showcase"
    },
    {
      src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Food Festival Extravaganza"
    },
    {
      src: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Tech Innovation Expo"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Art & Culture Festival"
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
        
        {/* Card Carousel */}
        <div className="flex justify-center">
          <CardCarousel
            images={eventImages}
            autoplayDelay={3000}
            showPagination={true}
            showNavigation={true}
          />
        </div>
        
        {/* Event Counter */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            {eventImages.length} exciting events happening at Supermal Karawaci
          </p>
        </div>
      </div>
    </section>
  );
};

export default Events;