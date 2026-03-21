// src/pages/templates/hooks/useTemplate.js
import { useState, useEffect } from 'react';

export const useTemplate = () => {
  const [savedTemplates, setSavedTemplates] = useState([]);

  useEffect(() => {
    loadSavedTemplates();
  }, []);

  const loadSavedTemplates = () => {
    const saved = localStorage.getItem('saved_templates');
    if (saved) {
      setSavedTemplates(JSON.parse(saved));
    }
  };

  const saveTemplate = async (template) => {
    try {
      const updated = [...savedTemplates, { id: Date.now(), ...template }];
      localStorage.setItem('saved_templates', JSON.stringify(updated));
      setSavedTemplates(updated);
      return true;
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      return false;
    }
  };

  const loadTemplate = (id) => {
    return savedTemplates.find(t => t.id === id);
  };

  const deleteTemplate = (id) => {
    const updated = savedTemplates.filter(t => t.id !== id);
    localStorage.setItem('saved_templates', JSON.stringify(updated));
    setSavedTemplates(updated);
  };

  const getTemplateList = () => {
    return savedTemplates;
  };

  return {
    savedTemplates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    getTemplateList
  };
};