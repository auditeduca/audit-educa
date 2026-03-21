import React from 'react';

const DateBar = React.forwardRef(({ activeTopic, setActiveTopic, ...props }, ref) => {
  // Get current date formatted
  const currentDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  // Capitalize first letter
  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  return (
    <div
      ref={ref}
      {...props}
      className="w-full bg-audit-navy border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-start gap-x-8 gap-y-2 py-3">
          {/* Date */}
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-audit-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]"></div>
            <span className="text-[11px] sm:text-xs font-bold text-white/90 uppercase tracking-widest">
              {formattedDate}
            </span>
          </div>

          {/* Separator */}
          <div className="hidden md:block w-px h-3 bg-white/10"></div>

          {/* Technical text */}
          <div className="flex items-center gap-2">
            <i className="fas fa-microchip text-audit-gold/70 text-[10px]"></i>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Acessibilidade em Conteúdo Contábil
            </span>
          </div>

          {/* Standards (hidden on mobile) */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            <span className="text-[10px] font-bold text-white/30 tracking-[0.2em]">
              IFRS • NBC • FASB • NIIF
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DateBar;