import Link from "next/link";
import { Icon } from "./icon";
import { SectionHeading } from "./section-heading";
import { SiteHeader } from "./site-header";
import { WorkforceVisual } from "./workforce-visual";

const designedForSegments = [
  {
    title: "Real Estate Companies",
    description: "Commercial & residential brokerages handling high inbound lead volume across multiple property listings.",
    icon: "sales" as const,
    stat: "Instant Triage",
  },
  {
    title: "Property Developers",
    description: "Master developers selling off-plan & luxury developments needing fast, structured lead qualification.",
    icon: "knowledge" as const,
    stat: "24/7 Off-Plan Sales",
  },
  {
    title: "Estate Agencies",
    description: "High-street and boutique real estate agencies looking to automate after-hours buyer and tenant inquiries.",
    icon: "clock" as const,
    stat: "Zero Missed Leads",
  },
  {
    title: "Commercial Property Firms",
    description: "Asset managers & commercial leasing agents qualifying corporate tenants and commercial property investors.",
    icon: "finance" as const,
    stat: "Qualified Pipeline",
  },
];

const aiEmployees = [
  { name: "AI Sales Employee", description: "Qualifies real estate buyers, gathers budget & timeline, and books viewings.", icon: "sales" as const },
  { name: "AI Customer Support Employee", description: "Delivers clear, helpful answers to property & lease inquiries 24/7.", icon: "support" as const },
  { name: "AI HR Employee", description: "Onboards agents and streamlines real estate team operations.", icon: "hr" as const },
  { name: "AI Finance Employee", description: "Keeps property commission and invoice workflows moving accurately.", icon: "finance" as const },
  { name: "AI Operations Employee", description: "Coordinates viewing schedules and CRM sync across property listings.", icon: "operations" as const },
];

const benefits = [
  { title: "Sub-5-Second Response", description: "Maya engages inbound leads instantly before competitors even see the notification.", icon: "clock" as const },
  { title: "7-Point Qualification", description: "Extracts property type, budget, location, bedrooms, timeline, and financing status.", icon: "conversation" as const },
  { title: "Viewing Appointment Booking", description: "Schedules private viewings directly into your sales team's calendars.", icon: "sparkle" as const },
  { title: "24/7 Pipeline Velocity", description: "Captures and qualifies high-intent weekend and evening buyer inquiries.", icon: "knowledge" as const },
];

export function LandingPage() {
  return (
    <div id="top" className="overflow-hidden bg-[#fbfbfa]">
      <SiteHeader />
      <main>
        {/* Real Estate Focused Hero Section */}
        <section className="relative isolate border-b border-black/[0.06]">
          <div className="absolute inset-x-0 top-0 -z-10 h-[680px] bg-[radial-gradient(ellipse_at_72%_28%,rgba(212,246,107,0.32),transparent_42%),radial-gradient(ellipse_at_10%_10%,rgba(226,239,210,0.55),transparent_35%)]" />
          <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-10 lg:px-10 lg:pb-28 lg:pt-28">
            <div className="max-w-2xl">
              <div className="animate-enter inline-flex items-center gap-2 rounded-full border border-[#d8e1cf] bg-white/75 px-3 py-1.5 text-xs font-semibold tracking-wide text-[#4d5c42] shadow-sm">
                <span className="size-1.5 rounded-full bg-[#91c54a]" />
                AUTOMATED REAL ESTATE LEAD QUALIFICATION
              </div>
              <h1 className="animate-enter [animation-delay:80ms] mt-7 text-balance text-[clamp(2.8rem,6vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.07em] text-[#161817]">
                Never Lose a High-Value <span className="text-[#68843d]">Real Estate Lead</span> Again.
              </h1>
              <p className="animate-enter [animation-delay:160ms] mt-7 max-w-xl text-pretty text-lg leading-8 text-[#5e625e] sm:text-xl">
                Maya, your AI Sales Employee, engages inbound property inquiries in sub-5-seconds, qualifies budget, timeline, and financing, and books viewing appointments 24/7.
              </p>
              <div className="animate-enter [animation-delay:240ms] mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#161817] px-6 py-3.5 text-sm font-semibold text-[#d4f66b] shadow-[0_8px_20px_rgba(22,24,23,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#303632] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#161817]"
                >
                  Book Real Estate Sales Demo <Icon name="arrow" className="size-4" />
                </a>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center rounded-full border border-[#daddd8] bg-white/90 px-6 py-3.5 text-sm font-semibold text-[#282b28] transition-colors hover:border-[#bfc8b6] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#161817]"
                >
                  Try Interactive AI Sales Demo
                </Link>
              </div>
              <div className="mt-12 flex items-center gap-4 text-sm text-[#626762]">
                <div className="flex -space-x-2">
                  <span className="size-7 rounded-full border-2 border-[#fbfbfa] bg-[#c6d5b5]" />
                  <span className="size-7 rounded-full border-2 border-[#fbfbfa] bg-[#c8caf0]" />
                  <span className="size-7 rounded-full border-2 border-[#fbfbfa] bg-[#f1d5b1]" />
                </div>
                <span>Trusted by ambitious real estate brokerages, agencies & developers.</span>
              </div>
            </div>
            <div className="animate-enter [animation-delay:250ms] relative lg:ml-auto lg:w-[110%]">
              <WorkforceVisual />
            </div>
          </div>
        </section>

        {/* Designed For Section */}
        <section id="designed-for" className="scroll-mt-24 border-b border-black/[0.06] bg-[#f6f8f4] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Targeted Solutions"
              title="Purpose-built for high-volume property businesses."
              description="Eliminate lead drop-off, streamline initial buyer triage, and equip your sales reps with fully qualified leads."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {designedForSegments.map((segment) => (
                <article
                  key={segment.title}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[#e2e6de] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#c5d8a2] hover:shadow-[0_16px_32px_rgba(38,48,30,0.07)]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="grid size-11 place-items-center rounded-xl bg-[#eff6e5] text-[#556c3a]">
                        <Icon name={segment.icon} />
                      </span>
                      <span className="rounded-full bg-[#eaf5d8] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#3d5720]">
                        {segment.stat}
                      </span>
                    </div>
                    <h3 className="mt-7 text-xl font-bold tracking-tight text-[#1c1f1c]">{segment.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#626762]">{segment.description}</p>
                  </div>
                  <div className="mt-8 border-t border-gray-100 pt-4">
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#455c27] transition-colors group-hover:text-[#1c1f1c]"
                    >
                      Schedule Segment Demo <Icon name="arrow" className="size-3.5" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Featured AI Employee Section */}
        <section id="platform" className="scroll-mt-24 border-b border-black/[0.06] bg-[#f0f3ed] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div>
              <SectionHeading
                eyebrow="Featured AI Employee"
                title={
                  <>
                    Your best real estate response time is <span className="text-[#6b883e]">now.</span>
                  </>
                }
                description="AI Sales Employee gives every property prospect a fast, intelligent, and consultative conversation—converting traffic into qualified viewings."
              />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <article className="rounded-xl border border-[#dbe2d5] bg-white/65 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7d8b72]">The Problem</p>
                  <p className="mt-2 text-sm leading-6 text-[#4f554e]">78% of buyers transact with the firm that responds first. Slow response kills deals.</p>
                </article>
                <article className="rounded-xl border border-[#dbe2d5] bg-white/65 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7d8b72]">The Solution</p>
                  <p className="mt-2 text-sm leading-6 text-[#4f554e]">Maya qualifies budget, timeline & financing in 5 mins and schedules viewings 24/7.</p>
                </article>
              </div>
              <div className="mt-8 flex items-start gap-3 rounded-xl border border-[#d5dfce] bg-white/70 p-4">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#dff3ad] text-[#4d6830]">
                  <Icon name="sparkle" className="size-3.5" />
                </span>
                <p className="text-sm leading-6 text-[#545a52]">
                  <strong className="font-semibold text-[#202420]">Executive Insights Included.</strong> Every conversation generates an automated Business Impact Report for your sales director.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 rounded-full bg-[#161817] px-6 py-3 text-sm font-semibold text-[#d4f66b] transition-transform hover:-translate-y-0.5"
                >
                  Test Maya Live Demo <Icon name="arrow" className="size-4" />
                </Link>
              </div>
            </div>
            <div id="sales-employee" className="scroll-mt-24 rounded-[28px] border border-[#d7e2cc] bg-[#171a18] p-5 shadow-[0_25px_55px_rgba(38,48,30,0.16)] sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#d4f66b] text-[#29351f]">
                    <Icon name="sales" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Maya — AI Sales Employee</p>
                    <p className="mt-0.5 text-xs text-white/45">Real Estate Specialist</p>
                  </div>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-[#d4f66b]">Active 24/7</span>
              </div>
              <div className="space-y-5 py-7">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/10 p-4 text-sm leading-6 text-white/75">
                  Hi, I&apos;m looking for a 4-bedroom luxury villa in Downtown Marina around $1.5M. Is anything available for a viewing this weekend?
                </div>
                <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-[#d4f66b] p-4 text-sm leading-6 text-[#26321d]">
                  Hi! I can assist with that immediately. We have two premium villas matching your budget in Downtown Marina. Are you planning a cash purchase or using a pre-approved mortgage?
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span className="size-1.5 rounded-full bg-[#d4f66b]" />
                  Maya qualified lead score: 94/100 (HOT LEAD)
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-5 text-center">
                <div>
                  <p className="text-lg font-semibold tracking-[-0.04em] text-white">Sub-5s</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-white/40">Response Time</p>
                </div>
                <div>
                  <p className="text-lg font-semibold tracking-[-0.04em] text-white">100%</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-white/40">7-Pt Qualified</p>
                </div>
                <div>
                  <p className="text-lg font-semibold tracking-[-0.04em] text-white">Book</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-white/40">Viewings</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Employees Lineup */}
        <section id="ai-employees" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="AI Workforce Expansion"
              title="Start with Real Estate Sales. Expand across operations."
              description="Deploy AI Sales Employee first to maximize revenue. Scale specialized AI team members as your portfolio grows."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {aiEmployees.map((employee, index) => (
                <article
                  key={employee.name}
                  className={`group relative min-h-[230px] rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(38,48,30,0.08)] ${
                    index === 0 ? "border-[#c2da91] bg-[#eff9d6]" : "border-[#e1e3df] bg-white hover:border-[#cfd6c9]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`grid size-11 place-items-center rounded-xl ${index === 0 ? "bg-[#cbed79] text-[#28341e]" : "bg-[#f2f4f0] text-[#5a6354]"}`}>
                      <Icon name={employee.icon} />
                    </span>
                    {index > 0 ? (
                      <span className="rounded-full bg-[#f2f3f1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#6a6e69]">Coming soon</span>
                    ) : (
                      <span className="rounded-full bg-[#d4f66b] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#405227]">Available Now</span>
                    )}
                  </div>
                  <h3 className="mt-8 text-lg font-semibold tracking-[-0.035em] text-[#1c1f1c]">{employee.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#626762]">{employee.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section id="solutions" className="scroll-mt-24 bg-[#f8faf6] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              centered
              eyebrow="Why Real Estate Leaders Choose MercyAI"
              title="Built for real estate pipeline growth."
              description="MercyAI combines sub-5-second speed with deep property qualification judgment."
            />
            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => (
                <article key={benefit.title} className="rounded-2xl border border-[#e0e2de] bg-white p-6 transition-shadow hover:shadow-[0_15px_30px_rgba(36,45,30,0.06)]">
                  <span className="grid size-11 place-items-center rounded-xl bg-[#eff4e9] text-[#63764d]">
                    <Icon name={benefit.icon} />
                  </span>
                  <h3 className="mt-8 text-lg font-semibold tracking-[-0.035em] text-[#1d201e]">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#666b66]">{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / Book Demo Call to Action */}
        <section id="contact" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#171a18] px-6 py-14 text-center sm:px-12 sm:py-20 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b7d66f]">Transform Your Real Estate Pipeline</p>
            <h2 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
              Ready to Automate Real Estate Lead Qualification?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-7 text-white/70 sm:text-lg">
              Book a 15-minute executive demo to see how an AI Sales Employee doubles viewing conversion rates for your team.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-white/80">
              <a href="mailto:avigailaniekan@gmail.com" className="inline-flex items-center gap-1.5 transition-colors hover:text-[#d4f66b]">
                ✉ avigailaniekan@gmail.com
              </a>
              <a href="tel:+2348143043419" className="inline-flex items-center gap-1.5 transition-colors hover:text-[#d4f66b]">
                📞 +234 814 304 3419
              </a>
            </div>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:avigailaniekan@gmail.com?subject=Real%20Estate%20AI%20Demo%20Booking"
                className="rounded-full bg-[#d4f66b] px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-[#1e2915] transition-transform hover:-translate-y-0.5 hover:bg-[#c6ea59]"
              >
                Book Real Estate Sales Demo →
              </a>
              <Link
                href="/demo"
                className="rounded-full border border-white/25 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Try Interactive AI Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/[0.07] px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-base font-semibold tracking-[-0.04em]">
              <span className="grid size-6 place-items-center rounded-lg bg-[#161817] text-[10px] text-[#d4f66b]">M</span>
              MercyAI
            </div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#6a6f69]">
              Automated AI Sales Employees for ambitious real estate organizations.
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#6a6f69]">
              <a href="mailto:avigailaniekan@gmail.com" className="hover:text-[#161817]">avigailaniekan@gmail.com</a>
              <span>•</span>
              <a href="tel:+2348143043419" className="hover:text-[#161817]">+234 814 304 3419</a>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-[#565b56]">
            <a href="#designed-for" className="hover:text-black">Designed For</a>
            <a href="#platform" className="hover:text-black">Platform</a>
            <a href="#solutions" className="hover:text-black">Solutions</a>
            <Link href="/demo" className="hover:text-black">Interactive Demo</Link>
            <a href="#contact" className="hover:text-black">Book Demo</a>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-black/[0.07] pt-5 text-xs text-[#838782]">
          © {new Date().getFullYear()} MercyAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
