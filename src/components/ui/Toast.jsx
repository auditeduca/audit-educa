import React from 'react';
import { useAuditUI } from '../context/AuditUIContext';  // one level up then into context

const Toast = () => {
  const { toast } = useAuditUI();
  if (!toast.visible) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-audit-navy text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl border-2 border-audit-gold flex items-center gap-3">
        <i className="fas fa-check-circle text-audit-gold"></i> {toast.message}
      </div>
    </div>
  );
};

export default Toast;