import React from 'react';

interface EssorLogoProps {
  variant?: 'default' | 'light' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  showSlogan?: boolean;
  className?: string;
}

export const EssorLogo: React.FC<EssorLogoProps> = ({
  variant = 'default',
  size = 'md',
  showSlogan = true,
  className = '',
}) => {
  // Size typography mapping
  const titleSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const sloganSizeClasses = {
    sm: 'text-[8px]',
    md: 'text-[9.5px]',
    lg: 'text-[12px]',
  };

  const iconSizes = {
    sm: 32,
    md: 44,
    lg: 60,
  };

  const iconDim = iconSizes[size];

  // Colors based on theme variant
  const esColorClass = variant === 'light' ? 'text-creme' : 'text-vert-profond';
  const sloganColorClass = variant === 'light' ? 'text-creme/80' : 'text-vert-profond/75';

  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
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
            {/* Dégradé Or Premium */}
            <linearGradient id="essorGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Dégradé Vert Profond pour le fond du Sceau */}
            <linearGradient id="essorSealBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0F5132" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>

            {/* Ombre portée subtile */}
            <filter id="essorGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Fond Hexagone / Sceau Adouci */}
          <path
            d="M24 3L42 12V36L24 45L6 36V12L24 3Z"
            fill="url(#essorSealBg)"
            stroke="url(#essorGoldGrad)"
            strokeWidth="2"
            strokeLinejoin="round"
            filter="url(#essorGlow)"
          />

          {/* Motif Monogramme E - Ailes & Flèche d'Ascension */}
          <path
            d="M15 32H31C32.1 32 32.7 30.7 31.9 29.9L28.5 26.5H15V32Z"
            fill="url(#essorGoldGrad)"
            fillOpacity="0.85"
          />
          <path
            d="M15 24H27C27.8 24 28.3 23 27.7 22.4L25.3 20H15V24Z"
            fill="url(#essorGoldGrad)"
          />
          <path
            d="M15 17.5V12H27L34 19L31.5 21.5L25 15H19.5V17.5H15Z"
            fill="url(#essorGoldGrad)"
          />
          <rect
            x="14"
            y="12"
            width="4.5"
            height="20"
            rx="1.5"
            fill="#FFFFFF"
            fillOpacity="0.9"
          />

          {/* Cercle d'Alerte WhatsApp en haut à droite */}
          <circle cx="39" cy="9" r="5" fill="#25D366" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="39" cy="9" r="2" fill="#ffffff" />
        </svg>
      </div>

      {/* Logotype Textuel + Slogan */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col justify-center text-left">
          <div className="flex items-center leading-none">
            <span className={`font-sora font-extrabold tracking-tight ${titleSizeClasses[size]} ${esColorClass}`}>
              ES<span className="text-or-ambre">SOR</span>
            </span>
            <span
              className="w-2.5 h-2.5 rounded-full bg-whatsapp inline-block ml-1.5 shadow-sm animate-pulse"
              title="Alertes WhatsApp Actives"
            />
          </div>

          {showSlogan && (
            <span className={`font-sora font-bold tracking-wider uppercase ${sloganSizeClasses[size]} ${sloganColorClass} leading-tight mt-1`}>
              Emplois · Stages · Bourses
            </span>
          )}
        </div>
      )}
    </div>
  );
};
