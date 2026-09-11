import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const ClientFlowLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  animated = true
}) => {
  const dimensions = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-9 h-9'
  }[size];

  return (
    <div
      className={`relative ${dimensions} rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-0.5 shadow-md shadow-blue-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 ${className}`}
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#A5B4FC" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>

        {/* Outer Orbit Flow Ring with continuous rotation */}
        <circle
          cx="18"
          cy="18"
          r="11"
          stroke="url(#flowGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="22 18"
          className={animated ? 'animate-[spin_4s_linear_infinite]' : ''}
          style={{ transformOrigin: '18px 18px' }}
        />

        {/* Counter-rotating inner ring */}
        <circle
          cx="18"
          cy="18"
          r="7.5"
          stroke="#FFFFFF"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeDasharray="10 14"
          className={animated ? 'animate-[spin_6s_linear_infinite_reverse] opacity-85' : 'opacity-85'}
          style={{ transformOrigin: '18px 18px' }}
        />

        {/* Pulsing Core */}
        <circle
          cx="18"
          cy="18"
          r="3.5"
          fill="#FFFFFF"
          filter="url(#logoGlow)"
          className={animated ? 'animate-pulse' : ''}
        />
      </svg>
    </div>
  );
};
