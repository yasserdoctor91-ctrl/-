import React from 'react';

interface DoctorLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  theme?: 'light' | 'dark' | 'purple';
  className?: string;
}

export const DoctorLogo: React.FC<DoctorLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  theme = 'purple',
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 28, title: 'text-base', sub: 'text-[10px]' },
    md: { icon: 38, title: 'text-xl', sub: 'text-xs' },
    lg: { icon: 50, title: 'text-2xl', sub: 'text-sm' },
    xl: { icon: 64, title: 'text-3xl', sub: 'text-base' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`} id="doctor-logo-brand">
      {/* Brand Icon SVG */}
      <div 
        className="relative flex items-center justify-center rounded-2xl p-2 shadow-sm transition-transform duration-200"
        style={{
          backgroundColor: theme === 'purple' ? '#0f172a' : theme === 'light' ? '#ffffff' : '#1e293b',
          color: theme === 'purple' ? '#ffffff' : '#0f172a',
          width: currentSize.icon + 10,
          height: currentSize.icon + 10
        }}
      >
        <svg 
          width={currentSize.icon} 
          height={currentSize.icon} 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle accent */}
          <circle cx="24" cy="24" r="22" stroke={theme === 'purple' ? '#10b981' : '#0f172a'} strokeWidth="2.5" strokeDasharray="6 3" />
          
          {/* Medical Plus Cross stylized with Doctor D */}
          <path 
            d="M20 12C20 10.8954 20.8954 10 22 10H26C27.1046 10 28 10.8954 28 10V20H38C39.1046 20 40 20.8954 40 22V26C40 27.1046 39.1046 28 38 28H28V38C28 39.1046 27.1046 40 26 40H22C20.8954 40 20 39.1046 20 38V28H10C8.89543 28 8 27.1046 8 26V22C8 20.8954 8.89543 20 10 20H20V12Z" 
            fill={theme === 'purple' ? '#10b981' : '#0f172a'} 
          />
          
          {/* Stethoscope / Core Pulse Wave */}
          <path 
            d="M14 24H18L21 17L27 31L30 24H34" 
            stroke={theme === 'purple' ? '#ffffff' : '#10b981'} 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Stethoscope Ear Loop Sparkle */}
          <circle cx="34" cy="16" r="3" fill={theme === 'purple' ? '#10b981' : '#0f172a'} />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span 
            className={`font-bold tracking-tight ${currentSize.title}`}
            style={{ 
              color: theme === 'light' ? '#ffffff' : '#0f172a',
              fontFamily: "'Cairo', 'Inter', sans-serif"
            }}
          >
            الدكتور
          </span>
          <span 
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider"
            style={{ 
              backgroundColor: '#0f172a', 
              color: '#10b981' 
            }}
          >
            WORKSPACE
          </span>
        </div>
        {showSubtitle && (
          <span 
            className={`font-medium ${currentSize.sub}`}
            style={{ color: theme === 'light' ? '#94a3b8' : '#64748b' }}
          >
            شركة الدكتور للرعاية المتكاملة
          </span>
        )}
      </div>
    </div>
  );
};
