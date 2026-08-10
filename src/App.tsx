import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { CoverageSection } from './components/CoverageSection';
import { PublishBanner } from './components/PublishBanner';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

export function App() {
  return (
    <div className="min-h-screen bg-creme text-encre font-inter flex flex-col selection:bg-or-ambre selection:text-vert-profond overflow-x-hidden">
      
      {/* 1. Barre de navigation (fixe en haut) */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2. Section Héro */}
        <HeroSection />

        {/* 3. Section "Comment ça marche" */}
        <HowItWorksSection />

        {/* 4. Section "Ce qu'on couvre" */}
        <CoverageSection />

        {/* 5. Bande "Publier une offre" */}
        <PublishBanner />

        {/* 6. CTA final */}
        <FinalCTA />
      </main>

      {/* 7. Pied de page */}
      <Footer />

    </div>
  );
}

export default App;
