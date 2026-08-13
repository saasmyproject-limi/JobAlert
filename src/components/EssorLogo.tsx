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
    sm: 'text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-4xl sm:text-5xl',
  };

  const sloganSizeClasses = {
    sm: 'text-[7.5px]',
    md: 'text-[9px]',
    lg: 'text-[11px]',
  };

  const iconSizes = {
    sm: 36,
    md: 48,
    lg: 64,
  };

  const iconDim = iconSizes[size];

  // Colors based on theme variant
  const esColorClass = variant === 'light' ? 'text-creme' : 'text-[#0F172A]';
  const sloganColorClass = variant === 'light' ? 'text-creme/80' : 'text-slate-600';

  return (
    <div className={`inline-flex items-center gap-3.5 select-none group ${className}`}>
      {/* Dynamic Soaring Wings & Arrow Logo Symbol */}
      <div className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        <svg
          width={iconDim}
          height={iconDim}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          <defs>
            {/* Dégradé Bleu Roi pour la flèche */}
            <linearGradient id="essorArrowBlue" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>

            {/* Dégradé Aile Supérieure Bleu Ciel */}
            <linearGradient id="essorWingBlue" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            {/* Dégradé Aile Inférieure Or / Orange Flamboyant */}
            <linearGradient id="essorWingOrange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Dégradé Badge Alerte */}
            <linearGradient id="essorAlertGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            {/* Ombre portée subtile */}
            <filter id="essorShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* Flèche d'Ascension Bleue (Base à Pointe) */}
          <path
            d="M12 44L28 28L34 34L46 16L41 16L49 11L44 19L39 19L32 29L26 23L12 44Z"
            fill="url(#essorArrowBlue)"
            filter="url(#essorShadow)"
          />

          {/* Plume / Aile Supérieure Courbée Bleu Ciel */}
          <path
            d="M20 28C16 18 24 10 36 8C28 14 26 22 30 28C26 26 22 26 20 28Z"
            fill="url(#essorWingBlue)"
          />

          {/* Plume / Aile Médiane Courbée Or & Orange */}
          <path
            d="M22 34C18 24 28 14 38 12C30 18 28 26 32 32C28 30 24 31 22 34Z"
            fill="url(#essorWingOrange)"
          />

          {/* Badge d'Alerte Intelligente en haut de la flèche (Remplace le logo WhatsApp) */}
          <g transform="translate(43, 6)">
            {/* Halo lumineux d'alerte */}
            <circle cx="9" cy="9" r="8" fill="#F59E0B" fillOpacity="0.2" className="animate-ping" />
            
            {/* Badge circulaire Or / Amber */}
            <circle cx="9" cy="9" r="8" fill="url(#essorAlertGold)" stroke="#FFFFFF" strokeWidth="1.5" />
            
            {/* Icône Cloche d'Alerte / Notification en blanc */}
            <path
              d="M9 4.5C7.6 4.5 6.5 5.6 6.5 7V9.2L5.8 9.9C5.4 10.3 5.7 11 6.3 11H11.7C12.3 11 12.6 10.3 12.2 9.9L11.5 9.2V7C11.5 5.6 10.4 4.5 9 4.5ZM7.8 12C8.1 12.6 8.7 13 9.4 13C10.1 13 10.7 12.6 11 12H7.8Z"
              fill="#FFFFFF"
            />
          </g>
        </svg>
      </div>

      {/* Logotype Textuel ESSOR + Slogan Officiel */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col justify-center text-left">
          <div className="flex items-center leading-none">
            <span className={`font-sora font-extrabold tracking-tight ${titleSizeClasses[size]} ${esColorClass}`}>
              ESSOR
            </span>
          </div>

          {showSlogan && (
            <span className={`font-sora font-bold tracking-wide ${sloganSizeClasses[size]} ${sloganColorClass} leading-tight mt-1`}>
              L'opportunité te trouve, avant que tu ailles la chercher
            </span>
          )}
        </div>
      )}
    </div>
  );
};
