import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import ThemeToggle from "@/components/ThemeToggle";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import Chat from "@/pages/Chat";
import Skills from "@/pages/Skills";
import Map from "@/pages/Map";
import CalendarPage from "@/pages/Calendar";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/projects" component={Projects} />
      <Route path="/chat" component={Chat} />
      <Route path="/skills" component={Skills} />
      <Route path="/map" component={Map} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <main className="pt-16">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
