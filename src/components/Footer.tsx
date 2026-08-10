import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-sauge/40 bg-creme py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs sm:text-sm text-encre/70 font-medium">
        
        {/* Left Side: Copyright */}
        <div>
          © {new Date().getFullYear()} JobAlert Cameroun. Tous droits réservés.
        </div>

        {/* Right Side: Topics List */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-vert-profond font-semibold">
          <span>Emploi</span>
          <span className="text-sauge">•</span>
          <span>Stages</span>
          <span className="text-sauge">•</span>
          <span>Bourses</span>
          <span className="text-sauge">•</span>
          <span className="text-whatsapp font-bold">Alertes WhatsApp</span>
        </div>

      </div>
    </footer>
  );
};
