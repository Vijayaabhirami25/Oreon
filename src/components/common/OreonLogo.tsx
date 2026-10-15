import React from 'react';

interface OreonLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  showTagline?: boolean;
  theme?: 'light' | 'dark';
}

export const OreonLogo: React.FC<OreonLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  theme = 'light',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  return (
    <div className="flex items-center gap-3">
      {/* Abstract Subterranean Strata & Sensor Node Icon */}
      <div
        className={`${iconSizes[size]} rounded-lg bg-[#FAF4EE] border border-[#C47A35]/30 flex items-center justify-center flex-shrink-0 shadow-sm`}
        title="OREON — Intelligence Beneath the Surface"
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
        >
          {/* Top geological stratum layer */}
          <path
            d="M5 8.5L16 3.5L27 8.5"
            stroke="#C47A35"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Middle subterranean stratum layer with sensor node junction */}
          <path
            d="M5 14L11 11.5L16 13.5L21 11.5L27 14"
            stroke="#C47A35"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
          {/* Deep geological stratum layer */}
          <path
            d="M5 19.5L16 24.5L27 19.5"
            stroke="#171A21"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Central intelligent sensor node */}
          <circle cx="16" cy="14" r="2.5" fill="#C47A35" />
          <circle cx="16" cy="14" r="4.5" stroke="#C47A35" strokeWidth="1" strokeDasharray="1.5 1.5" opacity="0.6" />
          {/* Lower protective anchor */}
          <path
            d="M16 24.5V28.5"
            stroke="#171A21"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showWordmark && (
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-extrabold tracking-wider font-sans ${titleSizes[size]} ${
                theme === 'dark' ? 'text-white' : 'text-[#171A21]'
              }`}
              style={{ letterSpacing: '0.06em' }}
            >
              OREON
            </span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FAF4EE] text-[#C47A35] border border-[#C47A35]/30">
              PLATFORM
            </span>
          </div>
          {showTagline && (
            <span
              className={`text-[10px] tracking-tight mt-0.5 font-medium truncate ${
                theme === 'dark' ? 'text-slate-400' : 'text-[#697386]'
              }`}
            >
              Intelligence Beneath the Surface.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
