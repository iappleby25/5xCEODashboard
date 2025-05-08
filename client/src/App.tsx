import { Switch, Route } from "wouter";
import { useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";

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

// Layout wrapper components
const PublicRoute = ({ component: Component, ...rest }: { component: React.ComponentType<any>, path: string }) => {
  return <Component {...rest} />;
};

const PrivateRoute = ({ component: Component, ...rest }: { component: React.ComponentType<any>, path: string }) => {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Only render the AppShell and component if authenticated
  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <AppShell>
      <Component {...rest} />
    </AppShell>
  );
};

function Router() {
  return (
    <Switch>
      {/* Public routes - no AppShell/Sidebar */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      
      {/* Private routes - with AppShell/Sidebar */}
      <Route path="/dashboard">
        {(params) => <PrivateRoute component={Dashboard} path="/dashboard" />}
      </Route>
      <Route path="/upload">
        {(params) => <PrivateRoute component={UploadData} path="/upload" />}
      </Route>
      <Route path="/history">
        {(params) => <PrivateRoute component={History} path="/history" />}
      </Route>
      <Route path="/5xCEO">
        {(params) => <PrivateRoute component={FiveXCEO} path="/5xCEO" />}
      </Route>
      <Route path="/comparisons">
        {(params) => <PrivateRoute component={Comparisons} path="/comparisons" />}
      </Route>
      <Route path="/admin/users">
        {(params) => <PrivateRoute component={UserManagement} path="/admin/users" />}
      </Route>
      
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
