import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import AppShell from "@/components/AppShell";
import Dashboard from "@/pages/Dashboard";
import UploadData from "@/pages/UploadData";
import History from "@/pages/History";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MyCEO from "@/pages/MyCEO";
import FiveXCEO from "@/pages/5xCEO";
import Comparisons from "@/pages/Comparisons";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/upload" component={UploadData} />
      <Route path="/history" component={History} />
      <Route path="/MyCEO" component={MyCEO} />
      <Route path="/5xCEO" component={FiveXCEO} />
      <Route path="/comparisons" component={Comparisons} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppShell>
          <Router />
        </AppShell>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
