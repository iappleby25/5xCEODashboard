import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./context/AuthContext";

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
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();
  
  // Public routes that don't need the AppShell layout
  const publicRoutes = ['/', '/login'];
  const isPublicRoute = publicRoutes.includes(location);
  
  // Determine if the current route should have the AppShell
  const shouldShowAppShell = isAuthenticated || !isPublicRoute;
  
  // Function to render a component with or without AppShell
  const renderWithLayout = (Component: React.ComponentType<any>) => {
    return (props: any) => {
      if (shouldShowAppShell) {
        return (
          <AppShell>
            <Component {...props} />
          </AppShell>
        );
      }
      return <Component {...props} />;
    };
  };
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={renderWithLayout(Dashboard)} />
      <Route path="/upload" component={renderWithLayout(UploadData)} />
      <Route path="/history" component={renderWithLayout(History)} />
      <Route path="/5xCEO" component={renderWithLayout(FiveXCEO)} />
      <Route path="/comparisons" component={renderWithLayout(Comparisons)} />
      <Route path="/admin/users" component={renderWithLayout(UserManagement)} />
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
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
