import React, { useState } from 'react';
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
import TreasureHunt from './components/TreasureHunt';

type Page = 'home' | 'treasure-hunt';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
  };

  if (currentPage === 'treasure-hunt') {
    return <TreasureHunt />;
  }

  return (
    <div className="min-h-screen">
      <Navbar onNavigate={navigateToPage} />
      <Hero onNavigate={navigateToPage} />
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