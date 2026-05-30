import { INTEGRATIONS } from '../../generated/integrations';

let appPromise = null;

export async function getFirebaseApp() {
  if (!INTEGRATIONS.firebase.enabled) return null;
  if (!appPromise) {
    appPromise = import('firebase/app').then(({ initializeApp }) =>
      initializeApp(INTEGRATIONS.firebase.config)
    );
  }
  return appPromise;
}

export function pushDataLayer(event) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}
