import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListFilter } from "lucide-react";

interface ViewLevel {
  value: string;
  label: string;
}

interface TimePeriod {
  value: string;
  label: string;
}

interface FilterBarProps {
  viewLevels: ViewLevel[];
  timePeriods: TimePeriod[];
  currentViewLevel: string;
  currentTimePeriod: string;
  showAdvancedFilters: boolean;
  departmentFilter: string;
  surveyTypeFilter: string;
  responseStatusFilter: string;
  onViewLevelChange: (value: string) => void;
  onTimePeriodChange: (value: string) => void;
  onToggleAdvancedFilters: () => void;
  onDepartmentFilterChange: (value: string) => void;
  onSurveyTypeFilterChange: (value: string) => void;
  onResponseStatusFilterChange: (value: string) => void;
}

export default function FilterBar({
  viewLevels,
  timePeriods,
  currentViewLevel,
  currentTimePeriod,
  showAdvancedFilters,
  departmentFilter,
  surveyTypeFilter,
  responseStatusFilter,
  onViewLevelChange,
  onTimePeriodChange,
  onToggleAdvancedFilters,
  onDepartmentFilterChange,
  onSurveyTypeFilterChange,
  onResponseStatusFilterChange,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-lg font-semibold mb-4 lg:mb-0">Survey Analytics Dashboard</h2>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Level Filter */}
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-neutral-500 mb-1">View Level</label>
            <Select value={currentViewLevel} onValueChange={onViewLevelChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select view level" />
              </SelectTrigger>
              <SelectContent>
                {viewLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Date Range */}
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-neutral-500 mb-1">Time Period</label>
            <Select value={currentTimePeriod} onValueChange={onTimePeriodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                {timePeriods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Advanced Filters Button */}
          <div className="flex items-end">
            <Button 
              variant="outline" 
              className="h-[38px]"
              onClick={onToggleAdvancedFilters}
            >
              <ListFilter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>
      </div>
      
      {/* Advanced filters section */}
      {showAdvancedFilters && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1">Department</label>
              <Select value={departmentFilter} onValueChange={onDepartmentFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Survey Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1">Survey Type</label>
              <Select value={surveyTypeFilter} onValueChange={onSurveyTypeFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select survey type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="pulse">Pulse</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Response Status */}
            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1">Response Status</label>
              <Select value={responseStatusFilter} onValueChange={onResponseStatusFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select response status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Responses</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="not_started">Not Started</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" onClick={() => {
              onDepartmentFilterChange("all");
              onSurveyTypeFilterChange("all");
              onResponseStatusFilterChange("all");
            }}>
              Reset
            </Button>
            <Button onClick={onToggleAdvancedFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
