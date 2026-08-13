import React from 'react';

interface EssorLogoProps {
  variant?: 'default' | 'light' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const EssorLogo: React.FC<EssorLogoProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  // Dimensions
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const iconSizes = {
    sm: 32,
    md: 40,
    lg: 56,
  };

  const iconDim = iconSizes[size];

  // Text color based on theme variant
  const esColorClass = variant === 'light' ? 'text-creme' : 'text-vert-profond';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      {/* Sceau Badge Icon (Concept 3) */}
      <div className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        <svg
          width={iconDim}
          height={iconDim}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          <defs>
            {/* Dégradé Or Premium pour le bord & l'envol */}
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Dégradé Vert Profond pour le fond du Sceau */}
            <linearGradient id="sealBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0F5132" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>

            {/* Ombre portée subtile */}
            <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Fond Hexagone / Sceau Adouci */}
          <path
            d="M24 3L42 12V36L24 45L6 36V12L24 3Z"
            fill="url(#sealBg)"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Motif Monogramme E - Ailes & Flèche d'Ascension */}
          {/* Ligne inférieure du E */}
          <path
            d="M15 32H31C32.1 32 32.7 30.7 31.9 29.9L28.5 26.5H15V32Z"
            fill="url(#goldGradient)"
            fillOpacity="0.85"
          />

          {/* Ligne médiane du E */}
          <path
            d="M15 24H27C27.8 24 28.3 23 27.7 22.4L25.3 20H15V24Z"
            fill="url(#goldGradient)"
          />

          {/* Ligne supérieure & Flèche d'Envol Ascendante du E */}
          <path
            d="M15 17.5V12H27L34 19L31.5 21.5L25 15H19.5V17.5H15Z"
            fill="url(#goldGradient)"
          />

          {/* Barre verticale de structure du E */}
          <rect
            x="14"
            y="12"
            width="4.5"
            height="20"
            rx="1.5"
            fill="#FFFFFF"
            fillOpacity="0.9"
          />

          {/* Cercle d'Alerte WhatsApp en haut à droite du Sceau */}
          <circle cx="39" cy="9" r="5" fill="#25D366" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="39" cy="9" r="2" fill="#ffffff" />
        </svg>
      </div>

      {/* Logotype Textuel (Masqué en mode icon-only) */}
      {variant !== 'icon-only' && (
        <div className="flex items-center">
          <span className={`font-sora font-extrabold tracking-tight ${sizeClasses[size]} ${esColorClass}`}>
            ES<span className="text-or-ambre">SOR</span>
          </span>
          <span
            className="w-2.5 h-2.5 rounded-full bg-whatsapp inline-block ml-1.5 shadow-sm animate-pulse"
            title="Alertes WhatsApp Actives"
          />
        </div>
      )}
    </div>
  );
};
