"use client";

import Link from "next/link";
import type { BusinessImpactReport } from "@/core/domain/business-impact";
import { DemoIcon } from "./demo-icon";

interface BusinessImpactReportProps {
  report: BusinessImpactReport;
  onBackToChat?: () => void;
}

export function BusinessImpactReportView({
  report,
  onBackToChat,
}: BusinessImpactReportProps) {
  const {
    leadSummary,
    qualificationStatus,
    qualificationDetails,
    leadScore,
    closingProbability,
    salespersonTimeSaved,
    recommendedNextAction,
    estimatedRevenueOpportunity,
    platformKPIs,
    teamScaling,
  } = report;

  return (
    <div className="space-y-8 animate-enter">
      {/* Top Banner & Control */}
      <div className="flex flex-col gap-4 rounded-3xl border border-[#d6dfce] bg-gradient-to-br from-[#181c19] via-[#212722] to-[#141715] p-6 text-white shadow-2xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d4f66b]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#d4f66b] border border-[#d4f66b]/30">
              <span className="size-2 rounded-full bg-[#d4f66b] animate-pulse" />
              Executive Business Impact Report
            </span>
            <span className={`rounded-full border px-3 py-1 text-xs font-extrabold tracking-wider ${leadScore.badgeClass}`}>
              {leadScore.tier} ({leadScore.score}/100)
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl text-white">
            Lead Qualification & Business Value Analysis
          </h2>
          <p className="mt-1 text-sm text-gray-300">
            Real-time ROI analysis derived from Maya’s 5-minute lead qualification session.
          </p>
        </div>
        {onBackToChat && (
          <button
            onClick={onBackToChat}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20 focus-visible:outline-2"
          >
            ← Back to Conversation
          </button>
        )}
      </div>

      {/* 4 Primary Executive Lead KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Lead Score Visual Ring Gauge */}
        <div className="relative overflow-hidden rounded-2xl border border-[#e0e4dc] bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#666c64]">Lead Score</span>
            <span className="rounded-full bg-[#eff7e4] px-2.5 py-0.5 text-[10px] font-bold text-[#456322]">
              {qualificationStatus.statusLabel}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-4">
            {/* SVG Ring Gauge */}
            <div className="relative size-16 shrink-0">
              <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-100"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#88b63a]"
                  strokeDasharray={`${leadScore.score}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-extrabold text-[#171a18]">{leadScore.score}</span>
              </div>
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-[#171a18]">{leadScore.tier}</p>
              <p className="mt-0.5 text-xs text-[#686e67]">High conversion intent</p>
            </div>
          </div>
        </div>

        {/* Closing Probability */}
        <div className="rounded-2xl border border-[#e0e4dc] bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#666c64]">Closing Probability</span>
            <span className="text-xs font-semibold text-[#486b24]">High</span>
          </div>
          <p className="mt-4 text-3xl font-extrabold tracking-tight text-[#171a18]">{closingProbability}%</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#91c54a] to-[#5e8b26]"
              style={{ width: `${closingProbability}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-[#686e67]">Based on budget & verified financing</p>
        </div>

        {/* Salesperson Time Saved */}
        <div className="rounded-2xl border border-[#e0e4dc] bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#666c64]">Time Saved / Lead</span>
            <span className="rounded-full bg-[#eaf4dd] px-2 py-0.5 text-[10px] font-bold text-[#456322]">
              100% Automated
            </span>
          </div>
          <p className="mt-4 text-3xl font-extrabold tracking-tight text-[#171a18]">{salespersonTimeSaved}</p>
          <p className="mt-2 text-xs text-[#686e67]">Saved on qualification & CRM data entry</p>
        </div>

        {/* Estimated Revenue Opportunity */}
        <div className="rounded-2xl border border-[#d6e3c5] bg-[#f5fbef] p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#435928]">Est. Deal Commission</span>
            <span className="rounded-full bg-[#d4f66b] px-2 py-0.5 text-[10px] font-extrabold text-[#253612]">
              Pipeline ROI
            </span>
          </div>
          <p className="mt-4 text-2xl font-extrabold tracking-tight text-[#223512] sm:text-3xl">
            {estimatedRevenueOpportunity}
          </p>
          <p className="mt-2 text-xs text-[#4f6636]">Estimated revenue value for this lead</p>
        </div>
      </div>

      {/* Lead Summary & Recommended Action */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#e0e4dc] bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-[#eff6e6] text-[#4d6a2a]">
              <DemoIcon name="sparkle" className="size-4" />
            </span>
            <h3 className="text-base font-bold text-[#171a18]">Executive Lead Summary</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#525751]">{leadSummary}</p>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#666c64]">Qualification Criteria Breakdown</h4>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {qualificationDetails.map((item) => (
                <div key={item.key} className="flex items-start justify-between rounded-xl bg-[#f8faf7] p-3 text-xs">
                  <div>
                    <span className="font-semibold text-[#656b63]">{item.label}</span>
                    <p className="mt-0.5 font-bold text-[#1a1d1a]">{item.value}</p>
                  </div>
                  <span
                    className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      item.isComplete
                        ? "bg-[#d4f66b] text-[#293b16]"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {item.isComplete ? "Verified" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Next Action Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#171a18] bg-[#171a18] p-6 text-white shadow-lg">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#d4f66b] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#1e2915]">
                Recommended Next Action
              </span>
              <span className="text-xs text-white/50">Sales Handoff</span>
            </div>
            <h4 className="mt-4 text-lg font-semibold text-white">Next Best Step for Sales Rep</h4>
            <p className="mt-3 text-sm leading-relaxed text-white/80">{recommendedNextAction}</p>
          </div>
          <div className="mt-6 border-t border-white/10 pt-4">
            <button className="w-full rounded-xl bg-[#d4f66b] py-3 text-center text-xs font-bold uppercase tracking-wider text-[#1e2915] transition hover:bg-[#c3e859]">
              Assign Lead to Senior Rep →
            </button>
          </div>
        </div>
      </div>

      {/* Four Executive Platform KPI Cards */}
      <div>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#5e783a]">Platform Performance</p>
          <h3 className="text-xl font-bold tracking-tight text-[#171a18]">Operational Excellence Metrics</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {platformKPIs.map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-[#e0e4dc] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#626861]">{kpi.label}</span>
                {kpi.change && (
                  <span className="rounded-full bg-[#eef7e3] px-2 py-0.5 text-[10px] font-extrabold text-[#456623]">
                    {kpi.change}
                  </span>
                )}
              </div>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#171a18]">{kpi.value}</p>
              <p className="mt-2 text-xs leading-relaxed text-[#686e67]">{kpi.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scale Section: Imagine This Running Across Your Entire Sales Team */}
      <div className="relative overflow-hidden rounded-3xl border border-[#c4dc98] bg-gradient-to-br from-[#f2fbdd] via-[#ffffff] to-[#eaf5d5] p-8 shadow-xl sm:p-10">
        <div className="max-w-3xl">
          <span className="rounded-full bg-[#c8ee5c] px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-[#2d3f18]">
            Enterprise Vision
          </span>
          <h3 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-[#181d16] sm:text-4xl">
            Imagine This Running Across Your Entire Sales Team
          </h3>
          <p className="mt-3 text-pretty text-base leading-relaxed text-[#4e574a] sm:text-lg">
            Deploying AI Sales Employees across your business transforms pipeline capacity, accelerates deal velocity, and guarantees zero missed opportunities 24 hours a day, 7 days a week.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#d2e4b4] bg-white/90 p-5 backdrop-blur-sm">
            <p className="text-xs font-bold text-[#687361]">Total Inbound Scale</p>
            <p className="mt-2 text-2xl font-extrabold text-[#1c2419]">{teamScaling.monthlyLeads}</p>
            <p className="mt-1 text-xs text-[#6a7563]">Handled simultaneously with zero queue time.</p>
          </div>

          <div className="rounded-2xl border border-[#d2e4b4] bg-white/90 p-5 backdrop-blur-sm">
            <p className="text-xs font-bold text-[#687361]">Rep Efficiency Boost</p>
            <p className="mt-2 text-2xl font-extrabold text-[#1c2419]">{teamScaling.hoursSavedPerMonth}</p>
            <p className="mt-1 text-xs text-[#6a7563]">Redirected to high-value closing conversations.</p>
          </div>

          <div className="rounded-2xl border border-[#d2e4b4] bg-white/90 p-5 backdrop-blur-sm">
            <p className="text-xs font-bold text-[#687361]">Pipeline Speed</p>
            <p className="mt-2 text-2xl font-extrabold text-[#1c2419]">{teamScaling.capacityMultiplier}</p>
            <p className="mt-1 text-xs text-[#6a7563]">Faster lead-to-appointment conversion cycle.</p>
          </div>

          <div className="rounded-2xl border border-[#d2e4b4] bg-white/90 p-5 backdrop-blur-sm">
            <p className="text-xs font-bold text-[#687361]">Net Financial ROI</p>
            <p className="mt-2 text-2xl font-extrabold text-[#283815]">{teamScaling.annualValueAdded}</p>
            <p className="mt-1 text-xs text-[#6a7563]">Estimated annual value added per 10 reps.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-[#d4e6b8] pt-6">
          <p className="text-xs font-semibold text-[#54614c]">
            Ready to empower your sales organization with AI Employees?
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-full bg-[#171a18] px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-[#d4f66b] shadow-md transition hover:bg-[#2c332e]"
          >
            Book Enterprise Workforce Demo →
          </Link>
        </div>
      </div>
    </div>
  );
}
