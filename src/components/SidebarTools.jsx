import React from 'react';
import { useAuditUI } from './context/AuditUIContext';

const SidebarTools = ({ sections, activeSection, onTourStart }) => {
  const { openDrawer, startTour } = useAuditUI();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (sections) {
    return (
      <aside className="sidebar-left-tools no-print" aria-label="Ferramentas Laterais">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => scrollTo(sec.id)}
            className={`tool-btn ${activeSection === sec.id ? 'active' : ''}`}
            title={sec.label}
          >
            <i className={`fas ${sec.icon}`} aria-hidden="true"></i>
            <span className="btn-label">{sec.label}</span>
          </button>
        ))}
        <button className="tool-btn" onClick={onTourStart || startTour} title="Ajuda Interativa">
          <i className="fas fa-magic text-audit-gold" aria-hidden="true"></i>
          <span className="btn-label">Ajuda</span>
        </button>
      </aside>
    );
  }

  return (
    <aside className="sidebar-left-tools no-print" aria-label="Ferramentas Laterais">
      <button className="tool-btn" onClick={() => openDrawer('teoria')} title="Teoria">
        <i className="fas fa-book-open"></i>
        <span className="btn-label">Teoria</span>
      </button>
      <button className="tool-btn" onClick={() => openDrawer('referencias')} title="Referências">
        <i className="fas fa-link"></i>
        <span className="btn-label">Referências</span>
      </button>
      <button className="tool-btn" onClick={() => openDrawer('sobre')} title="Sobre">
        <i className="fas fa-info-circle"></i>
        <span className="btn-label">Sobre</span>
      </button>
      <button className="tool-btn" onClick={onTourStart || startTour} title="Ajuda Interativa">
        <i className="fas fa-magic text-audit-gold" aria-hidden="true"></i>
        <span className="btn-label">Ajuda</span>
      </button>
    </aside>
  );
};

export default SidebarTools;