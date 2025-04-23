import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileUp, FileText, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";

interface UploadFormData {
  surveyType: string;
  period: string;
}

export default function UploadData() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { register, handleSubmit, setValue, watch } = useForm<UploadFormData>({
    defaultValues: {
      surveyType: "Employee Survey",
      period: "Q4 2023",
    },
  });

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Read file content
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        setFileContent(content);
      };
      reader.readAsText(selectedFile);
    }
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!fileContent) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const response = await apiRequest("POST", "/api/upload-csv", {
        fileContent,
        surveyType: data.surveyType,
        period: data.period,
      });

      const result = await response.json();

      toast({
        title: "Upload successful",
        description: result.message || "Data has been processed successfully",
      });

      // Record activity
      await apiRequest("POST", "/api/activities", {
        userId: 1, // Assuming user ID 1 for now
        type: "upload",
        description: `New survey data uploaded: ${data.surveyType} for ${data.period}`,
      });

      // Navigate to dashboard
      setLocation("/");
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto p-4 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Upload Survey Data</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center justify-center">
                <Upload className="h-12 w-12 text-neutral-400 mb-2" />
                <h4 className="text-lg font-medium text-neutral-700 mb-1">
                  Drag and drop your CSV file
                </h4>
                <p className="text-sm text-neutral-500 mb-4">
                  or click to browse files
                </p>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={onSelectFile}
                />
                <Button
                  type="button"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <FileUp className="h-4 w-4 mr-2" />
                  Select File
                </Button>
              </div>
              
              {file && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-medium truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <span className="text-neutral-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              )}
              
              <p className="mt-4 text-xs text-neutral-500">
                Supported formats: CSV with header row
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="survey-type">Data Type</Label>
                <Select 
                  defaultValue="Employee Survey"
                  onValueChange={(value) => setValue("surveyType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select survey type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Employee Survey">Employee Survey</SelectItem>
                    <SelectItem value="Customer Feedback">Customer Feedback</SelectItem>
                    <SelectItem value="Product Usage">Product Usage</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Survey Period</Label>
                <Select 
                  defaultValue="Q4 2023"
                  onValueChange={(value) => setValue("period", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select survey period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Q4 2023">Q4 2023</SelectItem>
                    <SelectItem value="Q3 2023">Q3 2023</SelectItem>
                    <SelectItem value="Q2 2023">Q2 2023</SelectItem>
                    <SelectItem value="Q1 2023">Q1 2023</SelectItem>
                    <SelectItem value="Custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setLocation("/")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!file || isUploading}
              >
                {isUploading ? "Processing..." : "Upload and Process"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
