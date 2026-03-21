import React from 'react';

const TopicFilter = ({ activeTopic, setActiveTopic }) => {
  const topics = [
    { id: 'all', label: 'Todos', icon: 'fa-th-large' },
    { id: 'auditoria', label: 'Auditoria Externa', icon: 'fa-search' },
    { id: 'interna', label: 'Auditoria Interna', icon: 'fa-shield-alt' },
    { id: 'ifrs', label: 'IFRS / CPC', icon: 'fa-book-open' },
    { id: 'pericia', label: 'Perícia', icon: 'fa-balance-scale' },
    { id: 'ia', label: 'IA Agêntica', icon: 'fa-robot' },
    { id: 'ferramentas', label: 'Ferramentas', icon: 'fa-tools' },
    { id: 'guias', label: 'Guias de Estudo', icon: 'fa-graduation-cap' }
  ];

  return (
    <nav className="topic-strip">
      <div className="topic-inner">
        {topics.map((topic, index) => (
          <React.Fragment key={topic.id}>
            <button
              className={`t-chip ${activeTopic === topic.id ? 'on' : ''}`}
              onClick={() => setActiveTopic(topic.id)}
            >
              <i className={`fas ${topic.icon}`}></i> {topic.label}
            </button>
            {index < topics.length - 1 && <div className="t-div"></div>}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default TopicFilter;