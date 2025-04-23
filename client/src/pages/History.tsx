import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Survey } from "@shared/schema";
import { FileText, BarChart, Sliders, Calendar, User } from "lucide-react";

export default function History() {
  const [activeTab, setActiveTab] = useState("uploads");

  // Fetch activities
  const { data: activities, isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  // Fetch surveys
  const { data: surveys, isLoading: surveysLoading } = useQuery<Survey[]>({
    queryKey: ["/api/surveys"],
  });

  // Filter activities by type
  const uploads = activities?.filter(activity => activity.type === "upload") || [];
  const reports = activities?.filter(activity => activity.type === "report") || [];
  const filters = activities?.filter(activity => activity.type === "filter") || [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <FileText className="h-4 w-4 text-secondary" />;
      case "report":
        return <BarChart className="h-4 w-4 text-primary" />;
      case "filter":
        return <Sliders className="h-4 w-4 text-info" />;
      default:
        return <FileText className="h-4 w-4 text-secondary" />;
    }
  };

  return (
    <div className="container max-w-6xl mx-auto p-4 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Activity History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="uploads" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="uploads" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Uploads
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="filters" className="flex items-center">
                <Sliders className="h-4 w-4 mr-2" />
                Filter Changes
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center">
                All Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="uploads">
              <ActivityTable 
                activities={uploads} 
                isLoading={activitiesLoading} 
                emptyMessage="No uploads found" 
              />
            </TabsContent>
            
            <TabsContent value="reports">
              <ActivityTable 
                activities={reports} 
                isLoading={activitiesLoading} 
                emptyMessage="No reports generated" 
              />
            </TabsContent>
            
            <TabsContent value="filters">
              <ActivityTable 
                activities={filters} 
                isLoading={activitiesLoading} 
                emptyMessage="No filter changes recorded" 
              />
            </TabsContent>
            
            <TabsContent value="all">
              <ActivityTable 
                activities={activities || []} 
                isLoading={activitiesLoading} 
                emptyMessage="No activity found" 
                showTypeColumn
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-2xl">Survey History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Survey Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveysLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading surveys...
                  </TableCell>
                </TableRow>
              ) : !surveys || surveys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No surveys found
                  </TableCell>
                </TableRow>
              ) : (
                surveys.map((survey) => (
                  <TableRow key={survey.id}>
                    <TableCell className="font-medium">{survey.title}</TableCell>
                    <TableCell>{survey.type}</TableCell>
                    <TableCell>{survey.period}</TableCell>
                    <TableCell>
                      {format(new Date(survey.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>243</TableCell> {/* This would be from responses table */}
                    <TableCell className="text-right">
                      <a href="/" className="text-primary hover:text-primary-dark">
                        View Dashboard
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

interface ActivityTableProps {
  activities: Activity[];
  isLoading: boolean;
  emptyMessage: string;
  showTypeColumn?: boolean;
}

function ActivityTable({ activities, isLoading, emptyMessage, showTypeColumn = false }: ActivityTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          {showTypeColumn && <TableHead>Type</TableHead>}
          <TableHead>Description</TableHead>
          <TableHead>User</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={showTypeColumn ? 4 : 3} className="text-center py-8 text-muted-foreground">
              Loading activities...
            </TableCell>
          </TableRow>
        ) : activities.length === 0 ? (
          <TableRow>
            <TableCell colSpan={showTypeColumn ? 4 : 3} className="text-center py-8 text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>
                {format(new Date(activity.createdAt), "MMM d, yyyy, h:mm a")}
              </TableCell>
              {showTypeColumn && (
                <TableCell>
                  <div className="flex items-center gap-1">
                    {activity.type === "upload" && <FileText className="h-4 w-4 text-secondary" />}
                    {activity.type === "report" && <BarChart className="h-4 w-4 text-primary" />}
                    {activity.type === "filter" && <Sliders className="h-4 w-4 text-info" />}
                    <span className="capitalize">{activity.type}</span>
                  </div>
                </TableCell>
              )}
              <TableCell>{activity.description}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center">
                    <User className="h-3 w-3 text-neutral-500" />
                  </div>
                  <span>Admin</span>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
