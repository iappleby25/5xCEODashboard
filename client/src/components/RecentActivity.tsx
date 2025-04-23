import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, BarChart2, Sliders } from "lucide-react";
import { format, isToday, isYesterday, subDays } from "date-fns";
import { Activity } from "@shared/schema";

interface RecentActivityProps {
  activities?: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  // If no activities provided, use empty array
  const activityList = activities || [];
  
  // Sort activities by date (newest first) and limit to 3
  const recentActivities = [...activityList]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <Upload className="text-secondary text-sm" />;
      case "report":
        return <BarChart2 className="text-primary text-sm" />;
      case "filter":
        return <Sliders className="text-info text-sm" />;
      default:
        return <Upload className="text-secondary text-sm" />;
    }
  };

  const formatDate = (date: Date | string) => {
    const activityDate = new Date(date);
    
    if (isToday(activityDate)) {
      return `Today at ${format(activityDate, "h:mm a")}`;
    } else if (isYesterday(activityDate)) {
      return `Yesterday at ${format(activityDate, "h:mm a")}`;
    } else if (activityDate > subDays(new Date(), 7)) {
      return format(activityDate, "EEEE 'at' h:mm a");
    } else {
      return format(activityDate, "MMM d, yyyy");
    }
  };

  // If no recent activities available, show a message
  if (recentActivities.length === 0) {
    return (
      <Card className="bg-white rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 text-neutral-500">
          <p>No recent activity found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {recentActivities.map((activity, index) => (
          <div 
            key={activity.id} 
            className={`flex items-start space-x-3 ${index < recentActivities.length - 1 ? "pb-3 border-b border-neutral-100" : ""}`}
          >
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {activity.type === "upload" && "New survey data uploaded"}
                {activity.type === "report" && "Report generated"}
                {activity.type === "filter" && "Filter settings updated"}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">{activity.description}</p>
              <p className="text-xs text-neutral-400 mt-1">{formatDate(activity.createdAt)}</p>
            </div>
          </div>
        ))}
        
        <div className="mt-3 text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-neutral-500 hover:text-neutral-700 text-sm"
            asChild
          >
            <a href="/history">View all activity</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
