import React from 'react';

/**
 * Componente Thumbnail para o Relatório Institucional
 * 
 * @param {Object} props
 * @param {string} [props.linkTo="/relatorio-institucional"] - URL de destino
 * @param {string} [props.imageUrl="/images/executive-team.jpg"] - Imagem de fundo (local)
 * @param {string} [props.logoPath="/assets/images/logotipo-audit-educa-default.webp"] - Logo institucional
 */
const RelatorioThumbnails = ({
  linkTo = "/relatorio-institucional",
  imageUrl = "/images/executive-team.jpg",
  logoPath = "/assets/images/logotipo-audit-educa-default.webp",
}) => {
  // Fallback para a imagem corporativa (usa uma imagem placeholder caso a original falhe)
  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/400x500/0f172a/d4af37?text=Audit+Educa";
  };

  // Fallback para o logotipo: exibe um ícone simples
  const handleLogoError = (e) => {
    e.target.style.display = "none";
    const fallbackIcon = e.target.parentElement?.querySelector(".logo-fallback");
    if (fallbackIcon) fallbackIcon.style.display = "flex";
  };

  return (
    <article className="group relative bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-xl hover:shadow-[0_32px_64px_-15px_rgba(15,23,42,0.2)] transition-all duration-700 ease-out overflow-hidden">
      <a
        href={linkTo}
        className="block outline-none focus-visible:ring-2 ring-audit-gold rounded-[2rem]"
      >
        {/* Container da capa com perspectiva */}
        <div className="relative aspect-[3/4] perspective-1000">
          {/* Sombra projetada */}
          <div className="absolute inset-4 bg-black/40 blur-2xl rounded-2xl transform translate-x-4 translate-y-6 group-hover:opacity-0 transition-opacity duration-700" />

          {/* Capa principal */}
          <div className="relative w-full h-full bg-audit-navy rounded-2xl shadow-2xl transform-gpu rotate-y-[-10deg] rotate-x-[5deg] group-hover:rotate-0 transition-all duration-700 border border-white/10 overflow-hidden flex flex-col">
            {/* Padrão geométrico de fundo (decorativo) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
              <svg width="100%" height="100%">
                <pattern id="dots-gold" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#D4AF37" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#dots-gold)" />
              </svg>
            </div>

            {/* Elementos geométricos (decorativos) */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none" aria-hidden="true">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-audit-gold/10 rotate-45 transform" />
              <div className="absolute bottom-1/3 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-audit-gold/20 to-transparent -rotate-6 transform" />
            </div>

            {/* Área da imagem com overlay */}
            <div className="relative h-1/2 w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-audit-navy via-audit-navy/40 to-transparent z-10" />
              <img
                src={imageUrl}
                alt="Equipe Audit Educa"
                className="w-full h-full object-cover grayscale brightness-50 contrast-125 group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-1000 ease-in-out"
                loading="lazy"
                onError={handleImageError}
              />
            </div>

            {/* Conteúdo textual */}
            <div className="relative flex-1 p-6 flex flex-col justify-between z-20">
              {/* Cabeçalho com logotipo */}
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 p-1.5 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-inner flex items-center justify-center overflow-hidden relative">
                  <img
                    src={logoPath}
                    alt="Logo Audit Educa"
                    className="w-full h-full object-contain filter brightness-110"
                    onError={handleLogoError}
                  />
                  {/* Fallback: ícone simples */}
                  <div className="logo-fallback hidden absolute inset-0 items-center justify-center text-audit-gold">
                    <i className="fas fa-building text-xl"></i>
                  </div>
                </div>
                <div className="text-[9px] font-black text-audit-gold/40 tracking-[0.4em] uppercase vertical-text pt-1">
                  INSTITUCIONAL
                </div>
              </div>

              {/* Títulos */}
              <div className="space-y-1 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-[1px] w-6 bg-audit-gold/60"></div>
                  <span className="text-[9px] font-bold text-audit-gold uppercase tracking-[0.2em]">Audit Educa</span>
                </div>
                <h3 className="text-2xl font-serif text-white leading-tight">
                  Missão, Visão <br />
                  <span className="text-audit-gold italic">& Valores</span>
                </h3>
              </div>
            </div>

            {/* Overlay de interação */}
            <div className="absolute inset-0 bg-audit-navy/90 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center backdrop-blur-md z-30">
              <div className="group/btn relative">
                <div className="absolute inset-0 bg-audit-gold/20 rounded-full blur-xl group-hover/btn:blur-2xl transition-all"></div>
                <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                  <svg className="w-8 h-8 text-audit-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <p className="mt-6 text-white text-[10px] font-black uppercase tracking-[0.3em] translate-y-4 group-hover:translate-y-0 transition-all duration-700 opacity-0 group-hover:opacity-100">
                Ler Documento
              </p>
            </div>

            {/* Efeito de reflexo de vidro */}
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[25deg] transition-all duration-1000 group-hover:left-[100%] pointer-events-none" aria-hidden="true" />
          </div>
        </div>

        {/* Texto complementar externo */}
        <div className="mt-8 px-5 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-slate-900 font-bold text-lg group-hover:text-audit-gold transition-colors tracking-tight">
              Audit Educa
            </h4>
            <div className="flex gap-1" aria-hidden="true">
              <span className="w-1.5 h-1.5 rounded-full bg-audit-gold"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
            </div>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed font-medium">
            Conheça os pilares que sustentam nossa cultura organizacional e o compromisso com a excelência educacional.
          </p>
        </div>
      </a>

      {/* Estilos customizados (apenas classes que não estão no Tailwind padrão) */}
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-[-10deg] { transform: rotateY(-10deg) rotateX(5deg); }
        .vertical-text { writing-mode: vertical-rl; }
      `}} />
    </article>
  );
};

export default RelatorioThumbnails;