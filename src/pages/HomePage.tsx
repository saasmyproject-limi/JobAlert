import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { CoverageSection } from '../components/CoverageSection';
import { PublishBanner } from '../components/PublishBanner';
import { FinalCTA } from '../components/FinalCTA';

export const HomePage: React.FC = () => {
  return (
    <main className="flex-1">
      {/* 1. Section Héro */}
      <HeroSection />

      {/* 2. Section "Comment ça marche" */}
      <HowItWorksSection />

      {/* 3. Section "Ce qu'on couvre" */}
      <CoverageSection />

      {/* 4. Bande "Publier une offre" */}
      <PublishBanner />

      {/* 5. CTA final */}
      <FinalCTA />
    </main>
  );
};
