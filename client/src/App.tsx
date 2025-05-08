import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";

import AppShell from "@/components/AppShell";
import Dashboard from "@/pages/Dashboard";
import UploadData from "@/pages/UploadData";
import History from "@/pages/History";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import FiveXCEO from "@/pages/5xCEO";
import Comparisons from "@/pages/Comparisons";
import UserManagement from "@/pages/UserManagement";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/upload" component={UploadData} />
      <Route path="/history" component={History} />
      <Route path="/5xCEO" component={FiveXCEO} />
      <Route path="/comparisons" component={Comparisons} />
      <Route path="/admin/users" component={UserManagement} />
      {/* Redirect /MyCEO to /5xCEO for backward compatibility */}
      <Route path="/MyCEO">
        {() => {
          window.location.href = "/5xCEO";
          return null;
        }}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          <AppShell>
            <Router />
          </AppShell>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
