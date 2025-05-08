import { Card } from "@/components/ui/card";

// Simplified interface without the removed KPI data
interface KpiData {
  // Keeping the interface for type compatibility, but removing the fields
  // that were previously used for the participation and avg score tiles
}

interface KpiCardsProps {
  kpiData?: KpiData;
}

export default function KpiCards({ kpiData }: KpiCardsProps) {
  // Removed default data since we no longer need it

  // Return an empty div instead of the KPI cards
  // This maintains the component's presence in the codebase without showing any cards
  return (
    <div className="grid gap-4">
      {/* Participation and Average Score tiles have been removed */}
    </div>
  );
}
