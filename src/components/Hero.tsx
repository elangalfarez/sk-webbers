import React from 'react';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/7.jpg?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Supermal Karawaci Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
          Welcome to <br/> <span className="text-gold">Supermal Karawaci</span>
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
          Your Shopping, Culinary, & Entertainment Destination
        </p>
        <button className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-primary border border-gold text-white font-semibold rounded-full hover:bg-dark-gray hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg text-sm md:text-base">
          See What's On
          <ChevronRight className="ml-2 h-5 w-5" />
        </button>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gold rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;