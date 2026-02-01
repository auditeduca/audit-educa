import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Quotes from "./pages/Quotes";
import Historical from "./pages/Historical";
import Converter from "./pages/Converter";
import About from "./pages/About";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Quotes} />
      <Route path={"/historico"} component={Historical} />
      <Route path={"/conversor"} component={Converter} />
      <Route path={"/sobre"} component={About} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
