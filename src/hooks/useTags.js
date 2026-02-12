import { useState, useCallback } from 'react';

export default function useTags(initialTags = []) {
  const [tags, setTags] = useState(initialTags);
  const [inputValue, setInputValue] = useState('');

  const addTag = useCallback((tag) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed]);
    }
  }, [tags]);

  const removeTag = useCallback((tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
      setInputValue('');
    }
  }, [inputValue, addTag]);

  const reset = useCallback(() => {
    setTags([]);
    setInputValue('');
  }, []);

  return { tags, inputValue, setInputValue, addTag, removeTag, handleKeyDown, reset };
