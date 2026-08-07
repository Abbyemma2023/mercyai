export interface ExecutivePlatformKPI {
  label: string;
  value: string;
  change?: string;
  description: string;
  icon: "leads" | "speed" | "followup" | "clock";
}

export interface TeamScalingImpact {
  monthlyLeads: string;
  hoursSavedPerMonth: string;
  capacityMultiplier: string;
  annualValueAdded: string;
}

export interface QualificationDetail {
  key: string;
  label: string;
  value: string;
  isComplete: boolean;
}

export interface BusinessImpactReport {
  leadSummary: string;
  qualificationStatus: {
    completedCount: number;
    totalCount: number;
    percentage: number;
    statusLabel: string;
  };
  qualificationDetails: QualificationDetail[];
  budget: string;
  propertyType: string;
  preferredLocation: string;
  timeline: string;
  financing: string;
  leadScore: {
    score: number;
    tier: "HOT LEAD" | "WARM LEAD" | "NURTURE";
    badgeClass: string;
  };
  closingProbability: number;
  salespersonTimeSaved: string;
  recommendedNextAction: string;
  estimatedRevenueOpportunity: string;
  platformKPIs: ExecutivePlatformKPI[];
  teamScaling: TeamScalingImpact;
}
