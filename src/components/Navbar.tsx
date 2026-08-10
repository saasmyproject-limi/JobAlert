import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-creme/90 backdrop-blur-md border-b border-sauge/40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo JobAlert with WhatsApp Green Dot */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center">
            <span className="font-sora font-extrabold text-2xl tracking-tight text-vert-profond">
              Job<span className="text-or-ambre">Alert</span>
            </span>
            <span 
              className="w-2.5 h-2.5 rounded-full bg-whatsapp inline-block ml-1 shadow-sm animate-pulse" 
              title="Alerte WhatsApp Active"
            />
          </div>
        </a>

        {/* Desktop Navigation Links (Hidden under ~760px / md) */}
        <nav className="hidden min-[760px]:flex items-center gap-8 text-sm font-medium text-encre/80">
          <a 
            href="#comment-ca-marche" 
            className="hover:text-vert-profond transition-colors hover:font-semibold"
          >
            Comment ça marche
          </a>
          <a 
            href="#ce-qu-on-couvre" 
            className="hover:text-vert-profond transition-colors hover:font-semibold"
          >
            Ce qu'on couvre
          </a>
          <a 
            href="#publier-une-offre" 
            className="hover:text-vert-profond transition-colors hover:font-semibold"
          >
            Publier une offre
          </a>
        </nav>

        {/* Right Action: Pill Button */}
        <div>
          <a
            href="#creer-profil"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-vert-profond text-creme font-semibold text-sm hover:bg-vert-moyen transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            Créer mon profil
          </a>
        </div>

      </div>
    </header>
  );
};
