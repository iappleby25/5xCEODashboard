import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { 
  Menu, 
  Search, 
  Mic, 
  Bell, 
  HelpCircle, 
  Settings 
} from "lucide-react";
import logoSvg from "../assets/5xceo-logo.svg";

interface TopNavbarProps {
  onMenuClick: () => void;
  onVoiceSearchClick: () => void;
}

export default function TopNavbar({ onMenuClick, onVoiceSearchClick }: TopNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search submission
    console.log("Search for:", searchQuery);
  };

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
      <div className="hidden md:flex items-center mr-6">
        <img src={logoSvg} alt="AdvantageCEO Logo" className="h-8 w-8 mr-2" />
        <h1 className="text-xl font-bold text-neutral-900">AdvantageCEO</h1>
      </div>
      
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
          <Search className="h-4 w-4" />
        </div>
        <Input
          type="text"
          className="w-full pl-10 pr-4 py-2 rounded-md border border-neutral-200"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </form>
      
      {/* Voice Search */}
      <Button 
        variant="outline" 
        className="ml-2 flex items-center space-x-1 px-3 py-2"
        onClick={onVoiceSearchClick}
      >
        <Mic className="h-4 w-4 text-neutral-500" />
        <span className="hidden sm:inline text-sm">Voice Search</span>
      </Button>
      
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
