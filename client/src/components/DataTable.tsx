import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  RefreshCw, 
  TrendingDown, 
  TrendingUp, 
  Minus 
} from "lucide-react";
import { Department, Response } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps {
  responses?: Response[];
  departments?: Department[];
}

export default function DataTable({ responses, departments }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // If data is not loaded yet, show loading state
  if (!responses || !departments) {
    return (
      <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
        <CardHeader className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h3 className="font-medium">Survey Response Details</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="ghost" size="icon" disabled>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6">
            <Skeleton className="h-80 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process and organize data
  const tableData = responses.map(response => {
    const department = departments.find(d => d.id === response.departmentId);
    const completionRate = Math.round((response.completedParticipants / response.totalParticipants) * 100);
    const averageScore = response.averageScore / 10; // Convert to decimal (e.g., 42 -> 4.2)
    const previousScore = response.previousScore ? response.previousScore / 10 : null;
    const change = previousScore ? (averageScore - previousScore).toFixed(1) : "0.0";
    const trend = previousScore 
      ? averageScore > previousScore 
        ? "up" 
        : averageScore < previousScore 
          ? "down" 
          : "flat"
      : "flat";
    
    return {
      departmentId: response.departmentId,
      departmentName: department?.name || "Unknown",
      responses: `${response.completedParticipants} / ${response.totalParticipants}`,
      averageScore: `${averageScore.toFixed(1)}/5`,
      participation: completionRate,
      trend,
      change
    };
  });

  // Pagination
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const paginatedData = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
      <CardHeader className="flex items-center justify-between p-4 border-b border-neutral-200">
        <h3 className="font-medium">Survey Response Details</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="ghost" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Responses</TableHead>
              <TableHead>Avg. Score</TableHead>
              <TableHead>Participation</TableHead>
              <TableHead>Trend</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row.departmentId}>
                  <TableCell className="font-medium">
                    {row.departmentName}
                  </TableCell>
                  <TableCell>
                    {row.responses}
                  </TableCell>
                  <TableCell>
                    {row.averageScore}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">{row.participation}%</span>
                      <div className="w-24 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div 
                          className={`${row.participation >= 90 ? 'bg-success' : row.participation >= 75 ? 'bg-success' : 'bg-warning'} h-full rounded-full`} 
                          style={{ width: `${row.participation}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center ${
                      row.trend === 'up' 
                        ? 'text-success' 
                        : row.trend === 'down' 
                          ? 'text-error' 
                          : 'text-neutral-500'
                    }`}>
                      {row.trend === 'up' && <TrendingUp className="h-4 w-4 mr-1" />}
                      {row.trend === 'down' && <TrendingDown className="h-4 w-4 mr-1" />}
                      {row.trend === 'flat' && <Minus className="h-4 w-4 mr-1" />}
                      <span className="ml-1">{row.change}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="link" className="text-primary hover:text-primary-dark h-8">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="bg-neutral-50 px-4 py-3 border-t border-neutral-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-neutral-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, tableData.length)}
                </span>{" "}
                of <span className="font-medium">{tableData.length}</span> departments
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={`relative inline-flex items-center px-4 py-2 ${
                      currentPage === page ? "bg-primary/5 text-primary" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
