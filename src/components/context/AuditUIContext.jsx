import React, { createContext, useState, useContext } from 'react';

const AuditUIContext = createContext();

export const useAuditUI = () => useContext(AuditUIContext);

export const AuditUIProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: '', visible: false });
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [tourStep, setTourStep] = useState(null);

  const showToast = (message, duration = 3000) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), duration);
  };

  const openDrawer = (drawerId) => setActiveDrawer(drawerId);
  const closeDrawer = () => setActiveDrawer(null);

  const startTour = () => setTourStep(0);
  const nextTourStep = () => setTourStep(prev => prev + 1);
  const closeTour = () => setTourStep(null);

  return (
    <AuditUIContext.Provider
      value={{
        toast,
        showToast,
        activeDrawer,
        openDrawer,
        closeDrawer,
        tourStep,
        setTourStep,
        startTour,
        nextTourStep,
        closeTour,
      }}
    >
      {children}
    </AuditUIContext.Provider>
  );
};