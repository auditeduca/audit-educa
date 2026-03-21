import React from 'react';
import { Link } from 'react-router-dom';

export default function TopicLinks() {
  const topics = [
    { path: '/governanca', label: 'Governança Corporativa' },
    { path: '/acessibilidade', label: 'Acessibilidade Digital' },
    { path: '/esg', label: 'ESG & Sustentabilidade' },
    { path: '/normas', label: 'Normas Técnicas' },
    { path: '/qualidade', label: 'Qualidade e Compliance' },
  ];

  return (
    <div>
      {/* Cabeçalho refinado para combinar com as seções institucionais */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-audit-navy/5 to-audit-gold/10 rounded-xl flex items-center justify-center border border-audit-gold/20">
          <i className="fas fa-tags text-audit-gold text-xl"></i>
        </div>
        <div>
          <h3 className="text-xl font-serif font-bold text-audit-navy mb-1">
            Tópicos Relacionados
          </h3>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Explore Mais Conteúdos
          </p>
        </div>
      </div>

      {/* Grid flexível de Tags estilo Pill Premium */}
      <div className="flex flex-wrap gap-3">
        {topics.map((topic, index) => (
          <Link
            key={index}
            to={topic.path}
            className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-audit-navy hover:text-white hover:border-audit-navy hover:shadow-md transition-all duration-300 flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-audit-gold/50"
          >
            {/* Elemento visual (ponto dourado) que interage no hover */}
            <span className="w-1.5 h-1.5 rounded-full bg-audit-gold group-hover:bg-white transition-colors duration-300"></span>
            {topic.label}
          </Link>
        ))}
      </div>
    </div>
  );
}