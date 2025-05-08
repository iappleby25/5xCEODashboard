import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  UploadCloud, 
  Clock, 
  BarChart4, 
  LineChart, 
  Settings, 
  HelpCircle,
  User,
  Home,
  BarChart,
  PieChart,
  LogOut
} from "lucide-react";
import logoSvg from "../assets/advantage-ceo-final.svg";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isMobile, isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  // If it's a mobile sidebar and it's not open, don't render
  if (isMobile && !isOpen) {
    return null;
  }

  const sidebarClasses = cn(
    "bg-white w-64 border-r border-neutral-200 flex flex-col shadow-sm h-screen overflow-hidden",
    {
      "fixed inset-y-0 left-0 z-50": isMobile,
      "hidden md:flex": !isMobile && !isOpen,
    }
  );

  const isActive = (path: string) => {
    return location === path;
  };

  const linkClasses = (path: string) => {
    return cn(
      "flex items-center px-4 py-2 text-sm rounded-md", 
      {
        "bg-primary-light/10 text-primary font-medium": isActive(path),
        "text-neutral-600 hover:bg-neutral-100": !isActive(path)
      }
    );
  };
  
  // Check role-based access permissions
  const isPeBod = user?.role === 'PE & BOD' || user?.role === 'ADMIN';
  const isCeoOrLeadership = user?.role === 'CEO' || user?.role === 'LEADERSHIP TEAM' || user?.role === 'ADMIN';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <aside className={sidebarClasses}>
      <div className="p-4 border-b border-neutral-200 flex items-center space-x-2">
        <img src={logoSvg} alt="AdvantageCEO Logo" className="h-10 w-auto" />
        <h1 className="font-semibold text-lg">AdvantageCEO</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          <li className="px-2">
            <span className="px-4 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Main</span>
            <ul className="mt-2 space-y-1">
              <li>
                <Link 
                  href="/" 
                  onClick={isMobile ? onClose : undefined}
                  className={linkClasses("/")}
                >
                  <Home className="mr-3 h-4 w-4" />
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard" 
                  onClick={isMobile ? onClose : undefined}
                  className={linkClasses("/dashboard")}
                >
                  <LayoutDashboard className="mr-3 h-4 w-4" />
                  Performance Overview
                </Link>
              </li>
              <li>
                <Link 
                  href="/5xCEO" 
                  onClick={isMobile ? onClose : undefined}
                  className={linkClasses("/5xCEO")}
                >
                  <PieChart className="mr-3 h-4 w-4" />
                  MyCEO
                </Link>
              </li>
              <li>
                <Link 
                  href="/upload" 
                  onClick={isMobile ? onClose : undefined}
                  className={linkClasses("/upload")}
                >
                  <UploadCloud className="mr-3 h-4 w-4" />
                  Upload Data
                </Link>
              </li>
              <li>
                <Link 
                  href="/history" 
                  onClick={isMobile ? onClose : undefined}
                  className={linkClasses("/history")}
                >
                  <Clock className="mr-3 h-4 w-4" />
                  History
                </Link>
              </li>
            </ul>
          </li>
          
          <li className="mt-8 px-2">
            <span className="px-4 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Analysis</span>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="#" className="flex items-center px-4 py-2 text-sm rounded-md text-neutral-600 hover:bg-neutral-100">
                  <BarChart4 className="mr-3 h-4 w-4" />
                  Reports
                </a>
              </li>
              {isPeBod && (
                <li>
                  <Link 
                    href="/comparisons" 
                    onClick={isMobile ? onClose : undefined}
                    className={linkClasses("/comparisons")}
                  >
                    <LineChart className="mr-3 h-4 w-4" />
                    Comparisons
                  </Link>
                </li>
              )}
            </ul>
          </li>
          
          {isAdmin && (
            <li className="mt-8 px-2">
              <span className="px-4 py-2 text-xs font-semibold text-purple-500 uppercase tracking-wider flex items-center">
                Admin
                <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-600 rounded-md">
                  Full Access
                </span>
              </span>
              <ul className="mt-2 space-y-1">
                <li>
                  <Link 
                    href="/admin/users" 
                    onClick={isMobile ? onClose : undefined}
                    className="flex items-center px-4 py-2 text-sm rounded-md text-purple-600 hover:bg-purple-50"
                  >
                    <User className="mr-3 h-4 w-4" />
                    User Management
                  </Link>
                </li>
                <li>
                  <a href="#" className="flex items-center px-4 py-2 text-sm rounded-md text-purple-600 hover:bg-purple-50">
                    <BarChart4 className="mr-3 h-4 w-4" />
                    Data Configuration
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-4 py-2 text-sm rounded-md text-purple-600 hover:bg-purple-50">
                    <Settings className="mr-3 h-4 w-4" />
                    System Settings
                  </a>
                </li>
              </ul>
            </li>
          )}
          
          <li className="mt-8 px-2">
            <span className="px-4 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Settings</span>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="#" className="flex items-center px-4 py-2 text-sm rounded-md text-neutral-600 hover:bg-neutral-100">
                  <User className="mr-3 h-4 w-4" />
                  Profile
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center px-4 py-2 text-sm rounded-md text-neutral-600 hover:bg-neutral-100">
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center px-4 py-2 text-sm rounded-md text-neutral-600 hover:bg-neutral-100">
                  <HelpCircle className="mr-3 h-4 w-4" />
                  Help
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      
      <div className="border-t border-neutral-200 p-4">
        {isAuthenticated && user ? (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full ${isAdmin ? 'bg-purple-100' : 'bg-neutral-200'} flex items-center justify-center`}>
                <User className={`h-4 w-4 ${isAdmin ? 'text-purple-500' : 'text-neutral-500'}`} />
              </div>
              <div>
                <p className="text-sm font-medium">{user.email}</p>
                <p className={`text-xs ${isAdmin ? 'text-purple-500 font-semibold' : 'text-neutral-400'}`}>
                  {user.role}
                  {isAdmin && <span className="ml-1 px-1 py-0.5 text-[10px] bg-purple-100 text-purple-600 rounded-md">Admin</span>}
                </p>
              </div>
            </div>
            <button 
              onClick={() => {
                logout();
                onClose();
                window.location.href = '/';
              }}
              className="flex items-center px-4 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 mt-2"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link 
              href="/login" 
              onClick={isMobile ? onClose : undefined}
              className="flex items-center px-4 py-2 text-sm rounded-md text-blue-600 hover:bg-blue-50"
            >
              <User className="mr-3 h-4 w-4" />
              Login
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
