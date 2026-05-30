import { useState, useEffect } from 'react';
import { updateConsent, trackEvent } from '../../core/integrations/analytics';
import { pushDataLayer } from '../../core/integrations/firebase';
import { INTEGRATIONS } from '../../generated/integrations';

const STORAGE_KEY = 'audit-educa-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!INTEGRATIONS.consent.required) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    updateConsent(true);
    pushDataLayer({ event: 'consent_update', analytics: true });
    trackEvent('consent_update', { analytics: true });
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, 'rejected');
    updateConsent(false);
    pushDataLayer({ event: 'consent_update', analytics: false });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-[9999] p-4 bg-audit-navy/95 text-white shadow-2xl border-t border-audit-gold/30"
      role="dialog"
      aria-label="Consentimento de cookies"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
        <p className="text-sm text-slate-200">
          Utilizamos cookies analíticos (Google Analytics {INTEGRATIONS.ga4.measurementId}, GTM{' '}
          {INTEGRATIONS.gtm.containerId}) para melhorar a experiência. Consulte nossa{' '}
          <a href="/politica-de-privacidade" className="text-audit-gold underline">
            Política de Privacidade
          </a>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={reject}
            className="px-4 py-2 text-xs font-bold uppercase border border-white/30 rounded-lg hover:bg-white/10"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={accept}
            className="px-4 py-2 text-xs font-bold uppercase bg-audit-gold text-audit-navy rounded-lg hover:bg-yellow-500"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
