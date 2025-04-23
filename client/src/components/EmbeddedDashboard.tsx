import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize, MoreVertical } from "lucide-react";
import useLuzmoEmbed from "@/hooks/useLuzmoEmbed";
import { Skeleton } from "@/components/ui/skeleton";

interface EmbedInfo {
  dashboardId: string;
  embedUrl: string;
  signature: string;
  timestamp: number;
  token: string;
}

interface EmbeddedDashboardProps {
  embedInfo?: EmbedInfo;
}

export default function EmbeddedDashboard({ embedInfo }: EmbeddedDashboardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { isLoading, error } = useLuzmoEmbed(
    "luzmo-container", 
    embedInfo?.dashboardId || "survey-1",
    embedInfo?.token || "",
    embedInfo?.signature || "",
    embedInfo?.timestamp || 0
  );

  const toggleFullscreen = () => {
    const elem = document.getElementById("dashboard-card");
    
    if (!isFullscreen) {
      if (elem?.requestFullscreen) {
        elem.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <Card id="dashboard-card" className="bg-white rounded-lg shadow-sm overflow-hidden">
      <CardHeader className="flex items-center justify-between p-4 border-b border-neutral-200">
        <h3 className="font-medium">Survey Results Overview</h3>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100"
            onClick={toggleFullscreen}
          >
            <Maximize className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6">
            <Skeleton className="h-80 w-full" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-error">
            <p>Failed to load dashboard: {error}</p>
          </div>
        ) : (
          <div 
            id="luzmo-container" 
            className="w-full h-96"
          ></div>
        )}
      </CardContent>
    </Card>
  );
}
