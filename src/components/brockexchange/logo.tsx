"use client";

export function Logo({ size = 40, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* NexTradePro logo — hexagon with N (gold) */}
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="nx-gold-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffed4e" />
            <stop offset="50%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#f0c000" />
          </linearGradient>
          <filter id="nx-glow-filter">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Hexagon outline */}
        <polygon
          points="50,8 86,29 86,71 50,92 14,71 14,29"
          fill="none"
          stroke="url(#nx-gold-grad)"
          strokeWidth="3"
          filter="url(#nx-glow-filter)"
        />
        {/* Inner hexagon fill */}
        <polygon
          points="50,14 80,31 80,69 50,86 20,69 20,31"
          fill="rgba(255,215,0,0.05)"
        />
        {/* N letter */}
        <text
          x="50" y="66"
          fontFamily="Inter, sans-serif"
          fontSize="38"
          fontWeight="900"
          fill="url(#nx-gold-grad)"
          textAnchor="middle"
          filter="url(#nx-glow-filter)"
        >N</text>
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-base font-extrabold tracking-tight">
            <span className="bx-text-gradient">Nex</span>
            <span className="text-white">Trade</span>
            <span className="bx-text-gradient">Pro</span>
          </span>
          <span className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Trade • Invest • Grow</span>
        </div>
      )}
    </div>
  );
}
