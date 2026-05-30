import { AuditUIProvider } from './components/context/AuditUIContext';
import SidebarTools from './components/SidebarTools';
import Drawers from './components/Drawers';
import Tour from './components/Tour';
import Toast from './components/ui/Toast';
import AccessibilityWidget from './components/AccessibilityWidget';
import CookieConsent from './components/consent/CookieConsent';
import GeneratedRoutes from './generated/routes.jsx';
import { useTrackPageView } from './core/integrations/trackPageView';
import { initAnalytics } from './core/integrations/analytics';

initAnalytics();

function AppRoutes() {
  useTrackPageView();
  return <GeneratedRoutes />;
}

function App() {
  return (
    <AuditUIProvider>
      <SidebarTools />
      <Drawers />
      <Tour />
      <AppRoutes />
      <AccessibilityWidget />
      <CookieConsent />
      <Toast />
    </AuditUIProvider>
  );
}

export default App;
