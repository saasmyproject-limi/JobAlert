import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { CoverageSection } from '../components/CoverageSection';
import { TeamSection } from '../components/TeamSection';
import { FaqSection } from '../components/FaqSection';
import { ContactSection } from '../components/ContactSection';
import { PublishBanner } from '../components/PublishBanner';
import { FinalCTA } from '../components/FinalCTA';

export const HomePage: React.FC = () => {
  return (
    <main className="flex-1 space-y-4">
      {/* 1. Section Héro */}
      <HeroSection />

      {/* 2. Section "Comment ça marche" */}
      <HowItWorksSection />

      {/* 3. Section "Ce qu'on couvre" */}
      <CoverageSection />

      {/* 4. Section "Porteurs du Projet / L'Équipe" */}
      <TeamSection />

      {/* 5. Section FAQ */}
      <FaqSection />

      {/* 6. Section Contact Us */}
      <ContactSection />

      {/* 7. Bande "Publier une offre" */}
      <PublishBanner />

      {/* 8. CTA final */}
      <FinalCTA />
    </main>
  );
};
