import React, { useState } from 'react';

/**
 * ShareSidebar Component - Horizontal social sharing bar
 * @param {Object} props
 * @param {string} [props.title='Sobre Nós - Audit Educa'] - Page title for sharing
 * @param {string} [props.url] - URL to share
 */
export default function ShareSidebar({
  title = 'Sobre Nós - Audit Educa',
  url = typeof window !== 'undefined' ? window.location.href : 'https://auditeduca.com.br'
} = {}) {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${title}\n\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleTikTokShare = () => {
    const shareUrl = encodeURIComponent(url);
    window.open(`https://www.tiktok.com/share?url=${shareUrl}`, '_blank');
  };

  const handleLinkedInShare = () => {
    const shareUrl = encodeURIComponent(url);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      '_blank',
      'width=550,height=680'
    );
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`${title}\n`);
    const twitterUrl = encodeURIComponent(url);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${twitterUrl}&hashtags=Auditoria,Contabilidade`,
      '_blank',
      'width=550,height=420'
    );
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Veja: ${title}`);
    const body = encodeURIComponent(`Confira este conteúdo incrível que encontrei no Audit Educa:\n\n${title}\n${url}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div 
      className="bg-white border-b border-slate-100/80 w-full"
      role="complementary"
      aria-label="Compartilhar página"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 py-3">
          
          {/* LEFT: Label com o visual Audit Educa */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <i className="fas fa-share-nodes text-audit-gold text-sm hidden sm:block"></i>
            <span 
              className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap"
              aria-hidden="true"
            >
              Compartilhe:
            </span>
          </div>

          {/* RIGHT: Social Buttons com Tooltip (Somente Ícones) */}
          <div className="flex items-center justify-center flex-wrap gap-2 w-full sm:w-auto">
            
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="group relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-[#25D366] hover:bg-[#25D366]/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#25D366]/50"
              aria-label="Compartilhar no WhatsApp"
            >
              <i className="fab fa-whatsapp text-base group-hover:scale-110 transition-transform duration-300"></i>
              {/* Tooltip Premium */}
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-audit-navy text-white text-[10px] font-bold rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                WhatsApp
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-audit-navy"></span>
              </span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={handleLinkedInShare}
              className="group relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/50"
              aria-label="Compartilhar no LinkedIn"
            >
              <i className="fab fa-linkedin-in text-base group-hover:scale-110 transition-transform duration-300"></i>
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-audit-navy text-white text-[10px] font-bold rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                LinkedIn
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-audit-navy"></span>
              </span>
            </button>

            {/* Twitter/X */}
            <button
              onClick={handleTwitterShare}
              className="group relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-black hover:bg-slate-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black/50"
              aria-label="Compartilhar no X (Twitter)"
            >
              <i className="fab fa-x-twitter text-base group-hover:scale-110 transition-transform duration-300"></i>
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-audit-navy text-white text-[10px] font-bold rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                X
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-audit-navy"></span>
              </span>
            </button>

            {/* TikTok */}
            <button
              onClick={handleTikTokShare}
              className="group relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-black hover:bg-slate-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black/50"
              aria-label="Compartilhar no TikTok"
            >
              <i className="fab fa-tiktok text-base group-hover:scale-110 transition-transform duration-300"></i>
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-audit-navy text-white text-[10px] font-bold rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                TikTok
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-audit-navy"></span>
              </span>
            </button>

            {/* Email */}
            <button
              onClick={handleEmailShare}
              className="group relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-audit-navy hover:bg-audit-navy/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-audit-navy/50"
              aria-label="Compartilhar por email"
            >
              <i className="fas fa-envelope text-base group-hover:scale-110 transition-transform duration-300"></i>
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-audit-navy text-white text-[10px] font-bold rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                Email
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-audit-navy"></span>
              </span>
            </button>

            {/* Separador Vertical */}
            <div className="hidden sm:block w-px h-4 bg-slate-200 mx-2"></div>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className={`group relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 ${
                copiedToClipboard
                  ? 'bg-green-50 text-green-600 focus:ring-green-500/50 border border-green-200/50'
                  : 'text-slate-500 hover:text-audit-gold hover:bg-audit-gold/10 focus:ring-audit-gold/50 border border-transparent'
              }`}
              aria-label={copiedToClipboard ? 'Link copiado!' : 'Copiar link'}
            >
              <i className={`text-base ${copiedToClipboard ? 'fas fa-check' : 'fas fa-link group-hover:rotate-45 transition-transform duration-300'}`}></i>
              
              <span className={`absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-bold rounded shadow-md transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50 ${
                copiedToClipboard 
                  ? 'bg-green-600 text-white opacity-100' 
                  : 'bg-audit-navy text-white opacity-0 group-hover:opacity-100'
              }`}>
                {copiedToClipboard ? 'Copiado!' : 'Copiar Link'}
                <span className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${
                  copiedToClipboard ? 'border-t-green-600' : 'border-t-audit-navy'
                }`}></span>
              </span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}