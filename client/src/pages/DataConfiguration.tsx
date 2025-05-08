import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

// Database table types for TypeScript
type DBTable = "users" | "departments" | "surveys" | "responses" | "activities";

export default function DataConfiguration() {
  const { user } = useAuth();
  const [activeTable, setActiveTable] = useState<DBTable>("users");
  
  // Only admin should access this page
  const isAdmin = user?.role === "ADMIN" as UserRole;

  // Query for the selected table data
  const { data: tableData = [], isLoading, error } = useQuery<any[]>({
    queryKey: [`/api/${activeTable}`],
    enabled: isAdmin, // Only fetch if user is admin
  });

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to view database configuration.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Database Configuration</CardTitle>
          <CardDescription>
            View and manage database tables for the AdvantageCEO platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" onValueChange={(value) => setActiveTable(value as DBTable)}>
            <TabsList className="mb-4">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="surveys">Surveys</TabsTrigger>
              <TabsTrigger value="responses">Survey Responses</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>

            {/* Users Table */}
            <TabsContent value="users">
              <DatabaseTable
                title="Users"
                description="User accounts and roles"
                data={tableData}
                isLoading={isLoading}
                error={error}
                columns={[
                  { key: "id", label: "ID" },
                  { key: "username", label: "Username" },
                  { key: "name", label: "Name" },
                  { key: "role", label: "Role" },
                  { key: "createdAt", label: "Created At", isDate: true }
                ]}
              />
            </TabsContent>

            {/* Departments Table */}
            <TabsContent value="departments">
              <DatabaseTable
                title="Departments"
                description="Organizational departments"
                data={tableData}
                isLoading={isLoading}
                error={error}
                columns={[
                  { key: "id", label: "ID" },
                  { key: "name", label: "Department Name" }
                ]}
              />
            </TabsContent>

            {/* Surveys Table */}
            <TabsContent value="surveys">
              <DatabaseTable
                title="Surveys"
                description="Survey information"
                data={tableData}
                isLoading={isLoading}
                error={error}
                columns={[
                  { key: "id", label: "ID" },
                  { key: "title", label: "Title" },
                  { key: "type", label: "Type" },
                  { key: "period", label: "Period" },
                  { key: "createdAt", label: "Created At", isDate: true },
                  { key: "createdBy", label: "Created By" }
                ]}
              />
            </TabsContent>

            {/* Responses Table */}
            <TabsContent value="responses">
              <DatabaseTable
                title="Survey Responses"
                description="Survey response data"
                data={tableData}
                isLoading={isLoading}
                error={error}
                columns={[
                  { key: "id", label: "ID" },
                  { key: "surveyId", label: "Survey ID" },
                  { key: "departmentId", label: "Department ID" },
                  { key: "totalParticipants", label: "Total Participants" },
                  { key: "completedParticipants", label: "Completed Participants" },
                  { key: "averageScore", label: "Average Score" },
                  { key: "previousScore", label: "Previous Score" },
                  { key: "createdAt", label: "Created At", isDate: true }
                ]}
              />
            </TabsContent>

            {/* Activities Table */}
            <TabsContent value="activities">
              <DatabaseTable
                title="Activities"
                description="User activities on the platform"
                data={tableData}
                isLoading={isLoading}
                error={error}
                columns={[
                  { key: "id", label: "ID" },
                  { key: "userId", label: "User ID" },
                  { key: "type", label: "Activity Type" },
                  { key: "description", label: "Description" },
                  { key: "createdAt", label: "Created At", isDate: true }
                ]}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Type for column definition
type Column = {
  key: string;
  label: string;
  isDate?: boolean;
  truncate?: boolean;
};

// Database Table component
function DatabaseTable({ 
  title, 
  description, 
  data, 
  isLoading, 
  error, 
  columns 
}: { 
  title: string; 
  description: string; 
  data: any[]; 
  isLoading: boolean; 
  error: unknown; 
  columns: Column[]; 
}) {
  // Format date values
  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleString();
    } catch (e) {
      return date;
    }
  };

  // Format cell content
  const formatCellContent = (item: any, column: Column) => {
    // Skip if no value
    if (item[column.key] === undefined || item[column.key] === null) {
      return '-';
    }
    
    // Handle date formatting
    if (column.isDate) {
      return formatDate(item[column.key]);
    }
    
    // Handle boolean values
    if (typeof item[column.key] === 'boolean') {
      return item[column.key] ? 'Yes' : 'No';
    }
    
    // Handle arrays
    if (Array.isArray(item[column.key])) {
      return item[column.key].join(', ');
    }
    
    // Handle objects (like JSON data)
    if (typeof item[column.key] === 'object') {
      return column.truncate
        ? JSON.stringify(item[column.key]).substring(0, 50) + '...'
        : JSON.stringify(item[column.key]);
    }
    
    // Handle text truncation
    if (column.truncate && typeof item[column.key] === 'string' && item[column.key].length > 50) {
      return item[column.key].substring(0, 50) + '...';
    }
    
    // Default case - return as is
    return item[column.key];
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Loading table data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load database table data.
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center border rounded-md">
        <p className="text-muted-foreground">No data found in this table.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableCaption>Database table: {title}</TableCaption>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.key}>{formatCellContent(item, column)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}