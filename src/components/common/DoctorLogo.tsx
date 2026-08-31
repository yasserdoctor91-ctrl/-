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
    sm: { icon: 28, box: 36, title: 'text-base', sub: 'text-[10px]' },
    md: { icon: 38, box: 44, title: 'text-xl', sub: 'text-xs' },
    lg: { icon: 50, box: 56, title: 'text-2xl', sub: 'text-sm' },
    xl: { icon: 64, box: 72, title: 'text-3xl', sub: 'text-base' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`} id="doctor-logo-brand">
      {/* Brand Icon using logo.svg */}
      <div 
        className="relative flex items-center justify-center rounded-2xl shadow-xs transition-transform duration-200 overflow-hidden shrink-0"
        style={{
          width: currentSize.box,
          height: currentSize.box
        }}
      >
        <img 
          src="/logo.svg" 
          alt="Doctor Workspace Logo" 
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span 
            className={`font-bold tracking-tight leading-none ${currentSize.title}`}
            style={{ 
              color: theme === 'light' ? '#ffffff' : '#0f172a',
              fontFamily: "'Cairo', 'Inter', sans-serif"
            }}
          >
            الدكتور
          </span>
          <span 
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider leading-none"
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
            className={`font-medium mt-1 leading-none ${currentSize.sub}`}
            style={{ color: theme === 'light' ? '#94a3b8' : '#64748b' }}
          >
            شركة الدكتور للرعاية المتكاملة
          </span>
        )}
      </div>
    </div>
  );
};
