"use client";

import { useState } from "react";
import { calculateBusinessImpact } from "@/core/application/conversation/business-impact-calculator";
import { getQualificationProgress } from "@/core/application/conversation/progress-tracker";
import { ActionCards } from "./action-cards";
import { BusinessImpactReportView } from "./business-impact-report";
import { ConversationPanel } from "./conversation-panel";
import { DemoHeader } from "./demo-header";
import { DemoIcon } from "./demo-icon";
import { EmployeeIntroduction } from "./employee-introduction";
import { QualificationProgress } from "./qualification-progress";
import { useDemoConversation } from "./use-demo-conversation";

export function DemoExperience() {
  const conversation = useDemoConversation();
  const [viewMode, setViewMode] = useState<"chat" | "report">("chat");

  if (!conversation.isStarted) {
    return (
      <div className="min-h-screen bg-[#fbfbfa]">
        <DemoHeader />
        <EmployeeIntroduction onStart={conversation.start} />
      </div>
    );
  }

  const progress = conversation.state ? getQualificationProgress(conversation.state) : [];
  const impactReport = calculateBusinessImpact(conversation.state?.qualification);
  const isQualificationComplete = conversation.state?.stage === "recommendation" || conversation.state?.stage === "appointment" || (conversation.state?.qualification.appointment ?? false);

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <DemoHeader />

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
        {/* Navigation & Mode Switcher Bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#e5e8e2] pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#66853f]">Interactive demonstration</p>
            <h1 className="mt-2 text-balance text-2xl font-semibold tracking-[-0.055em] text-[#171a18] sm:text-3xl">
              {viewMode === "chat" ? "See an AI Employee handle the first five minutes." : "Business Impact & Lead Qualification Brief"}
            </h1>
            <p className="mt-1 text-sm text-[#696e68]">
              {viewMode === "chat"
                ? "Maya qualifies a real-estate lead, recommends a fit, and makes the next step effortless."
                : "Executive ROI breakdown, lead scoring, salesperson time savings, and platform capacity metrics."}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="inline-flex shrink-0 items-center rounded-full border border-[#d6ded0] bg-white p-1 shadow-sm">
            <button
              onClick={() => setViewMode("chat")}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                viewMode === "chat"
                  ? "bg-[#171a18] text-white shadow-sm"
                  : "text-[#585e57] hover:text-[#171a18]"
              }`}
            >
              💬 Live Chat
            </button>
            <button
              onClick={() => setViewMode("report")}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                viewMode === "report"
                  ? "bg-[#171a18] text-white shadow-sm"
                  : "text-[#585e57] hover:text-[#171a18]"
              }`}
            >
              📊 Executive Report
              {isQualificationComplete && (
                <span className="size-2 rounded-full bg-[#d4f66b] animate-ping" />
              )}
            </button>
          </div>
        </div>

        {viewMode === "report" ? (
          <BusinessImpactReportView
            report={impactReport}
            onBackToChat={() => setViewMode("chat")}
          />
        ) : (
          <div className="space-y-6">
            {/* Qualification Completion Banner */}
            {isQualificationComplete && (
              <div className="animate-enter flex flex-col items-start gap-4 rounded-2xl border border-[#bce263] bg-gradient-to-r from-[#f0fcd4] via-[#f7fde8] to-[#ffffff] p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#d4f66b] text-[#213013]">
                    <DemoIcon name="sparkle" className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#1f2b15]">Lead Qualification Complete & Verified</h3>
                    <p className="text-xs text-[#52633e]">
                      Maya has gathered 7 key buyer parameters. Executive business impact metrics are now available.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewMode("report")}
                  className="inline-flex items-center gap-2 shrink-0 rounded-full bg-[#171a18] px-5 py-2.5 text-xs font-extrabold text-[#d4f66b] transition hover:bg-[#2b302c]"
                >
                  View Executive Business Impact Report →
                </button>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-start">
              <div>
                <ConversationPanel
                  isTyping={conversation.isTyping}
                  messages={conversation.messages}
                  onSend={conversation.sendMessage}
                />
                <div className="mt-4">
                  <ActionCards
                    disabled={conversation.isTyping}
                    onAction={conversation.sendAction}
                    onRestart={conversation.restart}
                    onViewReport={() => setViewMode("report")}
                  />
                </div>

                <details className="mt-4 rounded-2xl border border-[#e0e3de] bg-white p-5 lg:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-[#252925]">
                    Lead qualification progress <DemoIcon name="chevron" className="size-4" />
                  </summary>
                  <div className="pt-5">
                    <QualificationProgress items={progress} />
                  </div>
                </details>
              </div>

              <aside className="sticky top-6 hidden space-y-4 lg:block">
                <div className="rounded-2xl border border-[#e0e3de] bg-white p-5 shadow-[0_12px_28px_rgba(38,48,30,0.05)]">
                  <QualificationProgress items={progress} />
                </div>

                {/* Quick Link to Business Impact Report in Sidebar */}
                <div className="rounded-2xl border border-[#d2e4b4] bg-[#f6fcfe]/50 p-5 bg-gradient-to-b from-[#f5fcde] to-[#ffffff]">
                  <div className="flex items-center gap-2">
                    <span className="grid size-6 place-items-center rounded-md bg-[#d4f66b] text-[#223313]">
                      <DemoIcon name="sparkle" className="size-3.5" />
                    </span>
                    <span className="text-xs font-bold text-[#1f2b14]">Executive Impact</span>
                  </div>
                  <p className="mt-2 text-xs text-[#55634b]">
                    Review ROI metrics, salesperson time saved, and revenue opportunities.
                  </p>
                  <button
                    onClick={() => setViewMode("report")}
                    className="mt-3 w-full rounded-xl border border-[#171a18] bg-[#171a18] py-2 text-center text-xs font-bold text-[#d4f66b] transition hover:bg-[#2b302c]"
                  >
                    Open Executive Brief →
                  </button>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
