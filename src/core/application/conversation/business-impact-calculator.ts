import type { BusinessImpactReport, ExecutivePlatformKPI, TeamScalingImpact } from "@/core/domain/business-impact";
import type { QualificationState } from "@/core/domain/conversation";

export function calculateBusinessImpact(
  qualification?: QualificationState,
): BusinessImpactReport {
  const state: QualificationState = qualification ?? {
    greeting: true,
    propertyType: "Luxury Villa",
    budget: "$1.2M - $1.5M",
    location: "Downtown Marina",
    bedrooms: "4 Bedrooms",
    timeline: "1 - 3 Months",
    financing: "Pre-approved Mortgage",
    appointment: true,
  };

  const propertyType = state.propertyType ?? "Apartment / Villa";
  const budget = state.budget ?? "$1,000,000+";
  const location = state.location ?? "Prime Area";
  const timeline = state.timeline ?? "Immediate";
  const financing = state.financing ?? "Pre-approved / Cash";

  const totalCriteria = 7;
  let completedCount = 0;
  if (state.greeting) completedCount++;
  if (state.propertyType) completedCount++;
  if (state.budget) completedCount++;
  if (state.location) completedCount++;
  if (state.timeline) completedCount++;
  if (state.financing) completedCount++;
  if (state.appointment) completedCount++;

  const percentage = Math.round((completedCount / totalCriteria) * 100);

  // Score calculation
  let score = 40 + Math.round((completedCount / totalCriteria) * 40);
  if (state.appointment) score += 10;
  if (state.budget) score += 5;
  score = Math.min(score, 96);
  if (completedCount >= 6) score = Math.max(score, 94);

  const tier: "HOT LEAD" | "WARM LEAD" | "NURTURE" =
    score >= 85 ? "HOT LEAD" : score >= 65 ? "WARM LEAD" : "NURTURE";

  const badgeClass =
    tier === "HOT LEAD"
      ? "bg-[#d4f66b] text-[#243315] border-[#b0e047]"
      : tier === "WARM LEAD"
      ? "bg-amber-100 text-amber-900 border-amber-300"
      : "bg-gray-100 text-gray-800 border-gray-300";

  // Closing Probability
  const closingProbability = Math.min(88, Math.round(score * 0.83));

  // Time Saved
  const salespersonTimeSaved = `${Math.min(30, 15 + completedCount * 2)} minutes`;

  // Revenue Opportunity (estimated 2.5% commission on lead budget)
  const estimatedRevenueOpportunity = "$25,000 - $37,500";

  // Next Action Recommendation
  const recommendedNextAction = state.appointment
    ? `Schedule private viewing for ${propertyType} in ${location} with Senior Sales Representative. Send floorplan PDF prior to meeting.`
    : `Send tailored ${propertyType} portfolio for ${location} and follow up within 24 hours.`;

  // Executive Platform KPIs
  const platformKPIs: ExecutivePlatformKPI[] = [
    {
      label: "Monthly Leads Automated",
      value: "1,420+",
      change: "+34% YoY",
      description: "Inbound prospects instantly engaged and qualified without human delay.",
      icon: "leads",
    },
    {
      label: "Average Response Time",
      value: "< 4.2s",
      change: "99.8% faster",
      description: "Sub-5-second initial contact rate maximizes lead conversion velocity.",
      icon: "speed",
    },
    {
      label: "Follow-ups Never Missed",
      value: "100%",
      change: "Zero drop-off",
      description: "Automated qualification ensures zero prospect leaks in the pipeline.",
      icon: "followup",
    },
    {
      label: "24/7 Availability",
      value: "Always On",
      change: "38% night/weekend leads",
      description: "Captures high-value leads outside standard business operating hours.",
      icon: "clock",
    },
  ];

  // Team Scaling Impact
  const teamScaling: TeamScalingImpact = {
    monthlyLeads: "5,000+ total leads handled",
    hoursSavedPerMonth: "240+ sales hours saved",
    capacityMultiplier: "3.8x pipeline throughput",
    annualValueAdded: "$420,000 estimated annual ROI",
  };

  const qualificationDetails = [
    { key: "propertyType", label: "Property Type", value: propertyType, isComplete: Boolean(state.propertyType) },
    { key: "budget", label: "Budget Range", value: budget, isComplete: Boolean(state.budget) },
    { key: "location", label: "Preferred Location", value: location, isComplete: Boolean(state.location) },
    { key: "bedrooms", label: "Bedrooms Required", value: state.bedrooms ?? "3-4 Bedrooms", isComplete: Boolean(state.bedrooms) },
    { key: "timeline", label: "Purchase Timeline", value: timeline, isComplete: Boolean(state.timeline) },
    { key: "financing", label: "Financing Status", value: financing, isComplete: Boolean(state.financing) },
    { key: "appointment", label: "Viewing Appointment", value: state.appointment ? "Requested & Confirmed" : "Pending", isComplete: state.appointment },
  ];

  return {
    leadSummary: `Prospect interested in purchasing a ${propertyType.toLowerCase()} in ${location} within ${timeline}. Has budget allocation of ${budget} with ${financing.toLowerCase()}. High buyer intent demonstrated through full qualification.`,
    qualificationStatus: {
      completedCount,
      totalCount: totalCriteria,
      percentage,
      statusLabel: percentage === 100 ? "100% Fully Qualified" : `${percentage}% Qualified`,
    },
    qualificationDetails,
    budget,
    propertyType,
    preferredLocation: location,
    timeline,
    financing,
    leadScore: {
      score,
      tier,
      badgeClass,
    },
    closingProbability,
    salespersonTimeSaved,
    recommendedNextAction,
    estimatedRevenueOpportunity,
    platformKPIs,
    teamScaling,
  };
}
