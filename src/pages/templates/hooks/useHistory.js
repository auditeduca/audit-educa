// src/pages/templates/hooks/useHistory.js
import { useState, useEffect } from 'react';

export const useHistory = () => {
  const [versions, setVersions] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('template_versions');
    if (saved) {
      setVersions(JSON.parse(saved));
    }
  }, []);

  const addVersion = (templateId, variables) => {
    const templateVersions = versions[templateId] || [];
    const newVersion = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      variables: { ...variables }
    };
    
    const updated = {
      ...versions,
      [templateId]: [newVersion, ...templateVersions].slice(0, 20) // Manter últimas 20 versões
    };
    
    setVersions(updated);
    localStorage.setItem('template_versions', JSON.stringify(updated));
  };

  const getVersions = (templateId) => {
    return versions[templateId] || [];
  };

  const restoreVersion = (templateId, versionId) => {
    const templateVersions = versions[templateId] || [];
    const version = templateVersions.find(v => v.id === versionId);
    return version ? version.variables : null;
  };

  return {
    addVersion,
    getVersions,
    restoreVersion
  };
};