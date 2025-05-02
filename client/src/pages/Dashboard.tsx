import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FilterBar from "@/components/FilterBar";
import AiInsightPanel from "@/components/AiInsightPanel";
import EmbeddedDashboard from "@/components/EmbeddedDashboard";
import KpiCards from "@/components/KpiCards";
import GptSummaryCard from "@/components/GptSummaryCard";
import RecentActivity from "@/components/RecentActivity";
import DataTable from "@/components/DataTable";
import VoiceAssistant from "@/components/VoiceAssistant";
import { Activity, Department, Response } from "@shared/schema";

interface ViewLevel {
  value: string;
  label: string;
}

interface TimePeriod {
  value: string;
  label: string;
}

const viewLevels: ViewLevel[] = [
  { value: "all", label: "All Companies" },
  { value: "company", label: "Company" },
  { value: "individual", label: "Individual" },
];

const timePeriods: TimePeriod[] = [
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "6m", label: "Last 6 months" },
  { value: "1y", label: "Last year" },
  { value: "custom", label: "Custom range" },
];

export default function Dashboard() {
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [viewLevel, setViewLevel] = useState<string>("all");
  const [timePeriod, setTimePeriod] = useState<string>("30d");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [surveyTypeFilter, setSurveyTypeFilter] = useState<string>("all");
  const [responseStatusFilter, setResponseStatusFilter] = useState<string>("all");

  // Fetch departments
  const { data: departments } = useQuery<Department[]>({
    queryKey: ["/api/departments"],
  });

  // Fetch responses
  const { data: responses } = useQuery<Response[]>({
    queryKey: ["/api/responses"],
  });

  // Fetch activities
  const { data: activities } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  // Fetch insights from the most recent survey
  const { data: insightData } = useQuery({
    queryKey: ["/api/generate-insights/1"],
  });

  // Fetch KPI data for the dashboard
  const { data: kpiData } = useQuery({
    queryKey: ["/api/kpi-data/1"],
  });

  // Get Luzmo dashboard embed code
  const { data: luzmoEmbed } = useQuery({
    queryKey: ["/api/luzmo-dashboard/1"],
  });

  const toggleVoiceAssistant = () => {
    setShowVoiceAssistant(!showVoiceAssistant);
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-neutral-100 p-4 lg:p-6">
      {/* Filter Controls */}
      <FilterBar
        viewLevels={viewLevels}
        timePeriods={timePeriods}
        currentViewLevel={viewLevel}
        currentTimePeriod={timePeriod}
        showAdvancedFilters={showAdvancedFilters}
        departmentFilter={departmentFilter}
        surveyTypeFilter={surveyTypeFilter}
        responseStatusFilter={responseStatusFilter}
        onViewLevelChange={setViewLevel}
        onTimePeriodChange={setTimePeriod}
        onToggleAdvancedFilters={toggleAdvancedFilters}
        onDepartmentFilterChange={setDepartmentFilter}
        onSurveyTypeFilterChange={setSurveyTypeFilter}
        onResponseStatusFilterChange={setResponseStatusFilter}
      />

      {/* AI Insight Panel */}
      <AiInsightPanel insight={insightData} />

      {/* Section Headers */}
      <div className="flex mt-6 mb-4 border-b border-neutral-200">
        <h2 className="text-2xl font-bold text-neutral-800">myCEO</h2>
      </div>

      {/* myCEO Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Charts (Luzmo Embedded) - Spans 2 columns */}
        <div className="lg:col-span-2">
          <EmbeddedDashboard embedInfo={luzmoEmbed} />
        </div>

        {/* Summary Cards */}
        <div className="space-y-6">
          {/* KPI Cards */}
          <KpiCards kpiData={kpiData} />

          {/* Recent Activity */}
          <RecentActivity activities={activities} />
        </div>
      </div>

      {/* 5xCEO Section Header */}
      <div className="flex mt-10 mb-4 border-b border-neutral-200">
        <h2 className="text-2xl font-bold text-neutral-800">5xCEO</h2>
      </div>

      {/* 5xCEO Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">5x Assessment Model</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-100 rounded-lg p-4">
              <h4 className="font-medium">Strategic Clarity</h4>
              <p className="text-sm text-neutral-600">Score: 89%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>
            <div className="bg-teal-100 rounded-lg p-4">
              <h4 className="font-medium">Scalable Talent</h4>
              <p className="text-sm text-neutral-600">Score: 87%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div className="bg-red-100 rounded-lg p-4">
              <h4 className="font-medium">Relentless Focus</h4>
              <p className="text-sm text-neutral-600">Score: 77%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '77%' }}></div>
              </div>
            </div>
            <div className="bg-blue-100 rounded-lg p-4">
              <h4 className="font-medium">Disciplined Execution</h4>
              <p className="text-sm text-neutral-600">Score: 87%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <h4 className="font-medium">Energized Culture</h4>
              <p className="text-sm text-neutral-600">Score: 87%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* GPT-4 Summary Card */}
          <GptSummaryCard />
        </div>
      </div>

      {/* Data Tables Section */}
      <div className="mt-6">
        <DataTable responses={responses} departments={departments} />
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistant
        isOpen={showVoiceAssistant}
        onClose={toggleVoiceAssistant}
      />
    </div>
  );
}
