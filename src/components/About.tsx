import React from 'react';
import { ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <section className="py-20 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Supermal Karawaci Exterior"
              className="w-full h-96 object-cover rounded-2xl shadow-xl"
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl opacity-20"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-gold to-yellow-500 rounded-2xl opacity-20"></div>
          </div>
          
          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Supermal Karawaci</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Located in the heart of Tangerang, Supermal Karawaci is a lifestyle and shopping destination featuring hundreds of premium tenants, family-friendly experiences, and iconic events. We bring together the best of Indonesian hospitality with world-class shopping and dining experiences.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              From luxury fashion boutiques to authentic local cuisine, our mall offers something special for every visitor. Join us in creating memorable moments with your loved ones.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;