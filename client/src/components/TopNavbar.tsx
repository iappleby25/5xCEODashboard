import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Bell, 
  HelpCircle, 
  Settings 
} from "lucide-react";
import logoSvg from "../assets/5xceo-logo.svg";

interface TopNavbarProps {
  onMenuClick: () => void;
}

export default function TopNavbar({ onMenuClick }: TopNavbarProps) {
  return (
    <header className="bg-white border-b border-neutral-200 flex h-16 items-center px-4 lg:px-6">
      <button 
        type="button" 
        className="md:hidden text-neutral-500 p-2 rounded-md hover:bg-neutral-100 mr-2"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </button>
      
      {/* Logo and Title */}
      <div className="flex items-center mr-6">
        <img src={logoSvg} alt="AdvantageCEO Logo" className="h-8 w-8 mr-2" />
        <h1 className="text-xl font-bold text-neutral-900">AdvantageCEO</h1>
      </div>
      
      {/* Spacer to replace the search area */}
      <div className="flex-1"></div>
      
      <div className="flex items-center ml-auto space-x-4">
        <button type="button" className="p-1.5 rounded-full text-neutral-500 hover:bg-neutral-100">
          <Bell className="h-5 w-5" />
        </button>
        <button type="button" className="p-1.5 rounded-full text-neutral-500 hover:bg-neutral-100">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button type="button" className="p-1.5 rounded-full text-neutral-500 hover:bg-neutral-100">
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
