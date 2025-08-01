import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import FeaturedTenants from './components/FeaturedTenants';
import Events from './components/Events';
import FoodDining from './components/FoodDining';
import Facilities from './components/Facilities';
import VisitorInfo from './components/VisitorInfo';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedTenants />
      <Events />
      <FoodDining />
      <Facilities />
      <VisitorInfo />
      <About />
      <Footer />
    </div>
  );
}

export default App;