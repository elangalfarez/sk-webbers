import React from 'react';
import { Star } from 'lucide-react';

const FeaturedTenants = () => {
  const tenants = [
    {
      name: "Gino Mariani",
      category: "Fashion & Lifestyle",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/06/SnapInsta.to_501963295_18515755630054941_33900734510398049_n.jpg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: true
    },
    {
      name: "Starbucks",
      category: "Coffee & Beverages",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2021/04/unnamed-9.webp?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: true
    },
    {
      name: "Uniqlo",
      category: "Casual Wear",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/unnamed-13.webp?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: false
    },
    {
      name: "H&M",
      category: "Fashion Forward",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/hm-sk.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: true
    },
    {
      name: "Pizza Hut",
      category: "Family Dining",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: false
    },
    {
      name: "OH! Some",
      category: "Beauty & Cosmetics",
      image: "https://supermalkarawaci.co.id/core/wp-content/uploads/2022/12/ohsome.jpg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: true
    },
    {
      name: "Ace Hardware",
      category: "Home & Garden",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: false
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            New <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Tenants</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover premium brands and local favorites all under one roof
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex space-x-6 pb-4" style={{ width: 'max-content' }}>
            {tenants.map((tenant, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-72 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="relative">
                  <img 
                    src={tenant.image}
                    alt={tenant.name}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                  {tenant.featured && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tenant.name}</h3>
                  <p className="text-gray-600 mb-4">{tenant.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTenants;