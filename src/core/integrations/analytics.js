import { useEffect } from 'react';
import { INTEGRATIONS } from '../../generated/integrations';

let gtagReady = false;

export function initAnalytics() {
  const { ga4, consent } = INTEGRATIONS;
  if (!ga4.enabled || ga4.viaGtmOnly) return;

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }

  const granted = consent.defaultAnalytics ? 'granted' : 'denied';
  window.gtag('consent', 'default', {
    analytics_storage: granted,
    ad_storage: granted,
  });

  window.gtag('js', new Date());
  window.gtag('config', ga4.measurementId, { send_page_view: false });
  gtagReady = true;
}

export function updateConsent(analyticsGranted) {
  if (!window.gtag) return;
  const v = analyticsGranted ? 'granted' : 'denied';
  window.gtag('consent', 'update', { analytics_storage: v, ad_storage: v });
}

export function trackPageView(path, title) {
  const { ga4 } = INTEGRATIONS;
  if (!ga4.enabled || ga4.viaGtmOnly || !gtagReady) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });
}

export function trackEvent(name, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
  if (window.gtag) window.gtag('event', name, params);
}

export function usePageTracking() {
  useEffect(() => {
    initAnalytics();
  }, []);
}
