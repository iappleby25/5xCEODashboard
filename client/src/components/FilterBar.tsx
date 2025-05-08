import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Filter,
  Calendar,
  BarChart,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

// Define the interface for view levels
export interface ViewLevel {
  value: string;
  label: string;
}

// Define the interface for time periods
export interface TimePeriod {
  value: string;
  label: string;
}

// Define the props for the FilterBar component
interface FilterBarProps {
  viewLevels: ViewLevel[];
  timePeriods: TimePeriod[];
  currentViewLevel: string;
  currentTimePeriod: string;
  showAdvancedFilters: boolean;
  departmentFilter: string;
  surveyTypeFilter: string;
  responseStatusFilter: string;
  selectedCompany?: string;
  selectedRole?: string;
  selectedFirm?: string;
  companies: string[];
  roles: string[];
  onViewLevelChange: (value: string) => void;
  onTimePeriodChange: (value: string) => void;
  onToggleAdvancedFilters: () => void;
  onDepartmentFilterChange: (value: string) => void;
  onSurveyTypeFilterChange: (value: string) => void;
  onResponseStatusFilterChange: (value: string) => void;
  onCompanyChange?: (value: string) => void;
  onRoleChange?: (value: string) => void;
  onFirmChange?: (value: string) => void;
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
  selectedCompany,
  selectedRole,
  selectedFirm,
  companies,
  roles,
  onViewLevelChange,
  onTimePeriodChange,
  onToggleAdvancedFilters,
  onDepartmentFilterChange,
  onSurveyTypeFilterChange,
  onResponseStatusFilterChange,
  onCompanyChange,
  onRoleChange,
  onFirmChange,
}: FilterBarProps) {
  // Get user role from context
  const { user } = useAuth();
  
  // Check if the user can change view level based on their role
  // We'll use a dummy function if the handler isn't meant to do anything
  const canChangeViewLevel = viewLevels.length > 1;
  
  // Find the current view level's label
  const currentViewLevelLabel = viewLevels.find(
    (level) => level.value === currentViewLevel
  )?.label || "All Levels";

  // Find the current time period's label
  const currentTimePeriodLabel = timePeriods.find(
    (period) => period.value === currentTimePeriod
  )?.label || "All Time";
  
  // Check if user is restricted (CEO or LEADERSHIP TEAM)
  const isRestrictedUser = user?.role === 'CEO' || user?.role === 'LEADERSHIP TEAM';

  return (
    <div className="p-4 border-b border-neutral-200 bg-white">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          {canChangeViewLevel ? (
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">
                View Level
              </label>
              <Select value={currentViewLevel} onValueChange={onViewLevelChange}>
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Select level" />
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
          ) : (
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">
                View Level
              </label>
              <div className="h-9 w-[180px] px-3 flex items-center rounded-md border border-neutral-200 bg-neutral-50 text-sm text-neutral-600">
                {currentViewLevelLabel}
              </div>
            </div>
          )}

          {/* Show firm selector for holding view */}
          {currentViewLevel === "holding" && (
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">
                PE Firm
              </label>
              <Select 
                value={selectedFirm || "placeholder"} 
                onValueChange={onFirmChange}
                disabled={!onFirmChange}
              >
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Select firm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder">PE Firm Placeholder</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Show company selector for company and team views (locked for CEO and LEADERSHIP TEAM) */}
          {(currentViewLevel === "company" || currentViewLevel === "team") && (
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">
                Company
              </label>
              {isRestrictedUser && selectedCompany === "GlobalSolutions" ? (
                <div className="h-9 w-[180px] px-3 flex items-center rounded-md border border-neutral-200 bg-neutral-50 text-sm text-neutral-600">
                  GlobalSolutions
                </div>
              ) : (
                <Select 
                  value={selectedCompany} 
                  onValueChange={onCompanyChange}
                  disabled={!onCompanyChange}
                >
                  <SelectTrigger className="h-9 w-[180px]">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Only show the role selector for team view */}
          {currentViewLevel === "team" && (
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">
                Role
              </label>
              {/* For LEADERSHIP TEAM users in team view, show locked role */}
              {isRestrictedUser && selectedRole === "LEADERSHIP TEAM" ? (
                <div className="h-9 w-[180px] px-3 flex items-center rounded-md border border-neutral-200 bg-neutral-50 text-sm text-neutral-600">
                  LEADERSHIP TEAM
                </div>
              ) : (
                <Select 
                  value={selectedRole} 
                  onValueChange={onRoleChange}
                  disabled={!onRoleChange || (isRestrictedUser && selectedRole === "LEADERSHIP TEAM")}
                >
                  <SelectTrigger className="h-9 w-[180px]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">
              Time Period
            </label>
            <Select value={currentTimePeriod} onValueChange={onTimePeriodChange}>
              <SelectTrigger className="h-9 w-[180px]">
                <SelectValue placeholder="Select period" />
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
        </div>

        {/* Only show filter button for PE & BOD and ADMIN users */}
        {(!isRestrictedUser || user?.role === 'ADMIN') && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className={cn({
                "bg-primary-light/10 text-primary border-primary": showAdvancedFilters,
              })}
              onClick={onToggleAdvancedFilters}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {showAdvancedFilters ? (
                <XCircle className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Only show advanced filters for PE & BOD and ADMIN users */}
      {showAdvancedFilters && (!isRestrictedUser || user?.role === 'ADMIN') && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">
              Department
            </label>
            <Select value={departmentFilter} onValueChange={onDepartmentFilterChange}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="product">Product</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">
              Survey Type
            </label>
            <Select value={surveyTypeFilter} onValueChange={onSurveyTypeFilterChange}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="employee">Employee Engagement</SelectItem>
                <SelectItem value="customer">Customer Satisfaction</SelectItem>
                <SelectItem value="pulse">Pulse Check</SelectItem>
                <SelectItem value="exit">Exit Interview</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">
              Response Status
            </label>
            <Select value={responseStatusFilter} onValueChange={onResponseStatusFilterChange}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}