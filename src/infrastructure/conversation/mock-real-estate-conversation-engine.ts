import type { ConversationEngine } from "@/core/application/ports/conversation-engine";
import type {
  BuyerIntent,
  BuyerMotivation,
  BuyerReadiness,
  ConversationAction,
  ConversationEvent,
  ConversationMessage,
  ConversationStage,
  ConversationState,
  ConversationTurn,
  QualificationKey,
  QualificationState,
} from "@/core/domain/conversation";

const initialState: ConversationState = {
  stage: "property-type",
  qualification: { greeting: true, appointment: false, buyerReadiness: "browsing" },
};

function assistantMessage(content: string): ConversationMessage {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content,
    createdAt: new Date().toISOString(),
  };
}

function nextTurn(
  state: ConversationState,
  content: string,
): ConversationTurn {
  return { state, message: assistantMessage(content) };
}

function formatBedrooms(bedrooms?: string): string {
  if (!bedrooms) return "";
  const numMatch = bedrooms.match(/\d+/);
  return numMatch ? `${numMatch[0]}-bedroom` : bedrooms;
}

interface ExtractedEntities {
  propertyType?: string;
  bedrooms?: string;
  budget?: string;
  location?: string;
  timeline?: string;
  financing?: string;
  buyerIntent?: BuyerIntent;
  buyerMotivation?: BuyerMotivation;
  isCorrection?: boolean;
}

export function extractEntities(input: string, currentState: QualificationState): ExtractedEntities {
  const text = input.trim();
  const res: ExtractedEntities = {};

  // Check explicit correction
  const isCorrection = /^(?:actually|instead|no|change|make\s+that|make\s+it|correction)\b/i.test(text);
  res.isCorrection = isCorrection;

  // 1. Property Type
  const propertyMatch = text.match(/\b(villa|apartment|townhouse|penthouse|duplex|detached\s+house|semi-detached\s+house|terrace|condo|flat|mansion|bungalow|house|home)s?\b/i);
  if (propertyMatch) {
    let rawType = propertyMatch[0].toLowerCase();
    if (rawType.endsWith("s") && !rawType.endsWith("ss")) rawType = rawType.slice(0, -1);
    
    if (/\bdetached\b/i.test(text) && !rawType.includes("detached")) {
      res.propertyType = `detached ${rawType}`;
    } else if (/\bluxury\b/i.test(text)) {
      res.propertyType = `luxury ${rawType}`;
    } else if (/\bmodern\b/i.test(text)) {
      res.propertyType = `modern ${rawType}`;
    } else {
      res.propertyType = rawType;
    }
  }

  // 2. Bedrooms
  const bedMatch = text.match(/\b(\d+)\s*[- ]?(?:bed|bedroom|br|bdr)s?\b/i) ||
                   text.match(/\b(one|two|three|four|five|six|seven|eight)\s*[- ]?(?:bed|bedroom|br|bdr)s?\b/i);
  if (bedMatch) {
    const numMap: Record<string, string> = { one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8" };
    const num = numMap[bedMatch[1].toLowerCase()] ?? bedMatch[1];
    res.bedrooms = `${num} bedrooms`;
  }

  // 3. Location
  const knownLocations = [
    "lekki phase 1", "lekki phase 2", "chevron", "ikota", "ajah", "sangotedo", "marina", 
    "downtown marina", "downtown", "victoria island", "ikoyi", "banana island", "eko atlantic", 
    "beverly hills", "suburbs", "mainland", "ikeja", "waterfront", "beachfront"
  ];
  for (const loc of knownLocations) {
    if (new RegExp(`\\b${loc}\\b`, "i").test(text)) {
      res.location = loc.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      break;
    }
  }
  if (!res.location) {
    const genericLoc = text.match(/\b(lekki|ikeja|island|mainland|ikoyi)\b/i);
    if (genericLoc) {
      res.location = genericLoc[0].charAt(0).toUpperCase() + genericLoc[0].slice(1).toLowerCase();
    } else {
      const locMatch = text.match(/\b(?:in|around|near|at)\s+([A-Z][a-zA-Z0-9\s]{2,20})\b/);
      if (locMatch) {
        res.location = locMatch[1].trim().replace(/[.!?]+$/, "");
      }
    }
  }

  // 4. Budget & Uncertainty
  const budgetUncertain = /\b(?:not?\s+sure|don'?t\s+know|no\s+idea|flexible|depends|undecided|working\s+backwards|browsing)\b/i.test(text);
  if (budgetUncertain && !currentState.budget) {
    res.budget = "flexible / under evaluation";
  } else {
    const budgetMatches = text.match(/(?:[₦$]|N|USD)\s*\d+(?:\.\d+)?(?:\s*(?:m|million|k|thousand|b|billion))?|\b\d+(?:\.\d+)?\s*(?:m|million|k|thousand|b|billion)\b|\b\d{5,}\b/gi);
    if (budgetMatches && budgetMatches.length > 0) {
      res.budget = budgetMatches[0].trim().replace(/[.!?]+$/, "");
    }
  }

  // 5. Timeline (Excludes "before that", "before we", "before this")
  const timelineUncertain = /\b(?:no\s+rush|no\s+hurry|not?\s+sure|just\s+looking|exploring|sometime|anytime\s+soon)\b/i.test(text);
  if (timelineUncertain && !currentState.timeline) {
    res.timeline = "exploring options";
  } else {
    const timelineMatch = text.match(/\b(?:before\s+(?!that\b|this\b|we\b)[A-Za-z0-9]+|in\s+\d+\s*(?:month|year|week)s?|within\s+\d+\s*(?:month|year|day)s?|immediately|asap|this\s+year|next\s+month)\b/i);
    if (timelineMatch) {
      res.timeline = timelineMatch[0].trim().replace(/[.!?]+$/, "");
    }
  }

  // 6. Financing
  if (/\b(?:mortgage|pre-approved|bank\s+loan|financing)\b/i.test(text)) {
    res.financing = "pre-approved mortgage";
  } else if (/\b(?:cash|outright|self-funded|cash\s+buyer)\b/i.test(text)) {
    res.financing = "cash purchase";
  }

  // 7. Buyer Intent & Motivation
  if (/\b(?:rent\s+out|investment|invest|yield|roi|rental|capital\s+appreciation)\b/i.test(text)) {
    res.buyerIntent = "investor";
    res.buyerMotivation = /\b(?:yield|rental|rent\s+out)\b/i.test(text) ? "rental_yield" : "capital_growth";
  } else if (/\b(?:family|live\s+in|myself|our\s+home|relocat|home)\b/i.test(text)) {
    res.buyerIntent = "end-user";
    res.buyerMotivation = /\b(?:relocat)\b/i.test(text) ? "relocation" : "family_home";
  } else if (/\b(?:just\s+browsing|only\s+browsing|browsing|just\s+looking|checking\s+prices|exploring|not\s+ready\s+to\s+buy)\b/i.test(text)) {
    res.buyerIntent = "browsing";
    res.buyerMotivation = "browsing";
  }

  return res;
}

export function assessBuyerReadiness(q: QualificationState, explicitReq = false): BuyerReadiness {
  if (q.appointment || explicitReq) return "ready_for_inspection";
  if (q.buyerIntent === "browsing") return "browsing";
  
  const knownCount = [q.propertyType, q.bedrooms, q.budget, q.location, q.timeline, q.financing].filter(Boolean).length;
  if (knownCount === 6) return "high_intent";
  if (knownCount >= 4) return "serious";
  if (knownCount >= 2) return "interested";
  return "exploring";
}

export function determineNextStage(
  qualification: QualificationState,
  explicitRecommendationRequested = false,
): ConversationStage {
  if (qualification.appointment) return "appointment";
  if (explicitRecommendationRequested) return "recommendation";

  // CORRECTED FALLBACK ROUTING ORDER:
  // propertyType -> bedrooms -> budget -> location -> timeline -> financing
  const requiredFields: Array<{ key: keyof QualificationState; stage: ConversationStage }> = [
    { key: "propertyType", stage: "property-type" },
    { key: "bedrooms", stage: "bedrooms" },
    { key: "budget", stage: "budget" },
    { key: "location", stage: "location" },
    { key: "timeline", stage: "timeline" },
    { key: "financing", stage: "financing" },
  ];

  // A normal recommendation requires ALL SIX core fields to be evaluated OR explicit request!
  const missing = requiredFields.find((f) => !qualification[f.key]);
  if (!missing) {
    return "recommendation";
  }

  return missing.stage;
}

// =============================================================================
// RECOMMENDATION SYNTHESIS
//
// A recommendation is not a summary of extracted fields. Storing "before
// December" and then reciting it back proves nothing; the buyer needs to see
// that the constraint changed what would be prioritised. Everything below turns
// captured qualification state into the commercial reasoning that state
// implies.
//
// Nothing here asserts inventory, asking price, title status, completion dates,
// yield, ROI or appreciation. None of that is knowable from a conversation, so
// the copy stays in the register of "what I would prioritise and what I would
// want verified".
// =============================================================================

/** Sentinel written by extractEntities when the buyer has no budget in mind. */
const BUDGET_PLACEHOLDER = "flexible / under evaluation";

export type TimelinePressure = "deadline" | "near-term" | "relaxed" | "unspecified";
export type FinancingPosture = "mortgage-ready" | "cash" | "unspecified";
export type RecommendationLens = "investor" | "browsing" | "occupier";

/**
 * Timing only matters commercially through one question: does the buyer need
 * completion certainty, or can they afford to wait for the right property?
 */
export function classifyTimelinePressure(timeline?: string): TimelinePressure {
  if (!timeline) return "unspecified";
  const t = timeline.toLowerCase();

  if (/\b(?:no\s+rush|no\s+hurry|exploring|sometime|just\s+looking|not?\s+sure|flexible)\b/.test(t)) {
    return "relaxed";
  }
  if (/\b(?:immediately|asap|next\s+month)\b/.test(t)) return "near-term";

  const shortRange = t.match(/\b(?:in|within)\s+(\d+)\s*(month|week|day)s?\b/);
  if (shortRange) {
    return shortRange[2] !== "month" || Number(shortRange[1]) <= 6 ? "near-term" : "relaxed";
  }
  if (/\b(?:in|within)\s+\d+\s*years?\b/.test(t)) return "relaxed";
  if (/^before\s+/.test(t) || /\bthis\s+year\b/.test(t)) return "deadline";

  return "unspecified";
}

export function classifyFinancing(financing?: string): FinancingPosture {
  if (!financing) return "unspecified";
  const f = financing.toLowerCase();
  if (/\b(?:cash|outright|self-funded)\b/.test(f)) return "cash";
  if (/\b(?:mortgage|loan|financ|pre-approved)\b/.test(f)) return "mortgage-ready";
  return "unspecified";
}

/** Which commercial frame the recommendation is written in. */
export function recommendationLens(q: QualificationState): RecommendationLens {
  if (q.buyerIntent === "investor") return "investor";
  if (q.buyerIntent === "browsing") return "browsing";
  return "occupier";
}

/** A budget only constrains anything if the buyer actually named a figure. */
function concreteBudget(q: QualificationState): string | undefined {
  return q.budget && q.budget !== BUDGET_PLACEHOLDER ? q.budget : undefined;
}

function propertyPhrase(q: QualificationState): string {
  const bed = formatBedrooms(q.bedrooms);
  const type = q.propertyType ?? "home";
  return bed ? `${bed} ${type}` : type;
}

function capitalize(sentence: string): string {
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

/**
 * Fragments are authored lowercase-initial so the "Based on what you've told me
 * so far," qualifier can lead whichever fragment survives when information is
 * incomplete.
 */
function compose(lead: string, fragments: string[]): string {
  const [first, ...rest] = fragments;
  const head = lead ? `${lead}${first}` : capitalize(first);
  return [head, ...rest.map(capitalize)].join(" ");
}

function occupierFragments(q: QualificationState): string[] {
  const pressure = classifyTimelinePressure(q.timeline);
  const financing = classifyFinancing(q.financing);
  const budget = concreteBudget(q);
  const where = q.location ?? "your target area";
  const isFamily = q.buyerMotivation === "family_home";
  const household = isFamily ? "your family" : "you";
  const fragments: string[] = [];

  // TIMING -> completion certainty is the thing it actually changes.
  if (pressure === "deadline" || pressure === "near-term") {
    fragments.push(
      `your timing is the binding constraint here — you're aiming to move ${q.timeline}, so I'd put completed or near-completion properties ahead of anything with an uncertain handover date.`,
    );
  } else if (pressure === "relaxed") {
    fragments.push(
      `not having a fixed deadline is worth using rather than ignoring — with no date to hit, I'd rather wait for the right property than take whatever happens to be ready.`,
    );
  }

  // FINANCING -> readiness, never lender terms.
  if (financing === "mortgage-ready") {
    fragments.push(
      `with your financing already pre-approved, the open question isn't funding — it's whether a property's title and transaction structure are clean enough to move through a lender's process without holding things up.`,
    );
  } else if (financing === "cash") {
    fragments.push(
      `paying cash takes the financing chain out of the transaction, and that's leverage I'd spend on price and timing rather than on a more expensive property.`,
    );
  }

  // BUDGET + LOCATION -> the trade-off the money forces.
  const liveability = isFamily
    ? "security, estate management and move-in planning for a family"
    : "security, estate management and move-in planning";
  fragments.push(
    `${budget ? `at ${budget} in ${where}` : `in ${where}`}, the real trade-off is between a completed ${propertyPhrase(q)} in a well-managed estate — more predictable on ${liveability} — and a standalone option that buys more privacy and land but usually more uncertainty about when it is genuinely liveable.`,
  );

  fragments.push(
    `for either direction I'd want the title, the total acquisition cost including estate charges, and the actual occupancy position independently verified before treating it as a serious option.`,
  );

  fragments.push(
    pressure === "deadline" || pressure === "near-term"
      ? `which matters more to ${household} — being in ${q.timeline}, or the extra privacy and space?`
      : `which matters more to ${household} — move-in certainty, or the extra privacy and space?`,
  );

  return fragments;
}

function investorFragments(q: QualificationState): string[] {
  const pressure = classifyTimelinePressure(q.timeline);
  const financing = classifyFinancing(q.financing);
  const budget = concreteBudget(q);
  const where = q.location ?? "your target area";
  const fragments: string[] = [];

  fragments.push(
    `this is an income purchase rather than a home, so I'd judge it on the numbers rather than how it presents — tenant demand you can actually evidence in that specific pocket first, then the acquisition cost against realistic achievable rent.`,
  );

  // TIMING for an investor is about deploying capital, never about moving in.
  if (pressure === "relaxed") {
    fragments.push(
      `since there's no pressure to deploy quickly, I'd use that to hold out for a better entry price rather than take whatever is ready.`,
    );
  } else if (pressure === "deadline" || pressure === "near-term") {
    fragments.push(
      `you mentioned ${q.timeline} — for an income purchase I'd read that as when you want the capital working, so I'd weight properties that can be let sooner over anything still to be delivered.`,
    );
  }

  if (financing === "cash") {
    fragments.push(
      `paying cash removes the financing chain, which is leverage on entry price rather than a reason to stretch.`,
    );
  } else if (financing === "mortgage-ready") {
    fragments.push(
      `with financing already pre-approved, the question is whether the documentation and transaction structure will survive a lender's process without stalling the purchase.`,
    );
  }

  fragments.push(
    `${budget ? `at ${budget} in ${where}` : `in ${where}`}, I'd compare a ${propertyPhrase(q)} in an established, well-managed estate — easier to let and easier to exit — against a lower entry price outside the prime pocket, where the rent is lower but the purchase price does more of the work.`,
  );

  fragments.push(
    `before either is serious I'd want the service charge, the estate levies and the rents actually being achieved in that specific estate verified — I wouldn't work from a projected yield until those figures are confirmed.`,
  );

  fragments.push(`which would you rather optimise: steady occupancy, or a lower entry price?`);

  return fragments;
}

function browsingFragments(q: QualificationState): string[] {
  const budget = concreteBudget(q);
  const where = q.location;

  return [
    `you're comparing rather than buying, so the useful thing here isn't a shortlist — it's a clear picture of what ${budget ?? "your range"} has to trade off ${where ? `in ${where}` : "in the areas you're watching"}.`,
    `the honest split is usually between a completed home in a managed estate, where you're paying for services and predictability, and a standalone or off-plan option, where the headline price looks better but the total cost and the timeline are less certain.`,
    `the figures that actually decide it — service charges, total acquisition cost beyond the asking price, and the real completion position — are worth checking early, because they move the comparison more than the asking price does.`,
    `there's no rush on my side either, so tell me which of those two shapes you'd rather understand better and I'll go deeper on it.`,
  ];
}

/**
 * Builds the recommendation from the constraints that are actually present and
 * commercially relevant. `partial` marks the explicit-request path, where the
 * buyer asked before qualification was complete.
 */
export function buildRecommendation(
  q: QualificationState,
  options: { partial?: boolean } = {},
): string {
  const lead = options.partial ? "Based on what you've told me so far, " : "";

  switch (recommendationLens(q)) {
    case "investor":
      return compose(lead, investorFragments(q));
    case "browsing":
      return compose(lead, browsingFragments(q));
    default:
      return compose(lead, occupierFragments(q));
  }
}

export class MockRealEstateConversationEngine implements ConversationEngine {
  start(): ConversationTurn {
    return nextTurn(
      initialState,
      "Hi, I’m Maya, your AI Sales Employee. I help serious home buyers and investors find the right property without the typical back-and-forth. What kind of home are you looking for — an apartment, townhouse, or villa?",
    );
  }

  respond(event: ConversationEvent, state: ConversationState): ConversationTurn {
    if (event.type === "action") {
      return this.respondToAction(event.action, state);
    }

    return this.respondToMessage(event.content.trim(), state);
  }

  private respondToMessage(
    content: string,
    state: ConversationState,
  ): ConversationTurn {
    const textLower = content.toLowerCase();

    // Extract all entities and intent signals
    const extracted = extractEntities(content, state.qualification);

    // Clean state overwriting
    const updatedQualification: QualificationState = {
      ...state.qualification,
      ...(extracted.propertyType ? { propertyType: extracted.propertyType } : {}),
      ...(extracted.bedrooms ? { bedrooms: extracted.bedrooms } : {}),
      ...(extracted.location ? { location: extracted.location } : {}),
      ...(extracted.budget ? { budget: extracted.budget } : {}),
      ...(extracted.timeline ? { timeline: extracted.timeline } : {}),
      ...(extracted.financing ? { financing: extracted.financing } : {}),
      ...(extracted.buyerIntent ? { buyerIntent: extracted.buyerIntent } : {}),
      ...(extracted.buyerMotivation ? { buyerMotivation: extracted.buyerMotivation } : {}),
    };

    const explicitRecommendationRequested = /\b(?:recommend|recommendation|show\s+me\s+options|what\s+options|what\s+would\s+you\s+choose|what\s+would\s+you\s+prioritize|narrow\s+it\s+down)\b/i.test(textLower);
    updatedQualification.buyerReadiness = assessBuyerReadiness(
      updatedQualification,
      explicitRecommendationRequested,
    );

    const newlyExtractedKeys: QualificationKey[] = [];
    if (extracted.propertyType) newlyExtractedKeys.push("propertyType");
    if (extracted.bedrooms) newlyExtractedKeys.push("bedrooms");
    if (extracted.budget) newlyExtractedKeys.push("budget");
    if (extracted.location) newlyExtractedKeys.push("location");
    if (extracted.timeline) newlyExtractedKeys.push("timeline");
    if (extracted.financing) newlyExtractedKeys.push("financing");

    // =========================================================================
    // GOVERNING DECISION MODEL: SINGLE CONVERSATIONAL DECISION PATH (PRIORITIES 1-8)
    // =========================================================================

    // PRIORITY 1: DIRECT BUYER QUESTION / INQUIRY
    if (/\b(?:send\s+(?:me\s+)?(?:the\s+)?account|where\s+do\s+i\s+send|send\s+(?:the\s+)?money|pay\s+now|account\s+details|transfer\s+funds|make\s+payment)\b/i.test(textLower)) {
      const response = "Before making any payment, I'd want the payment instructions and beneficiary details independently confirmed through the authorized advisor or official company channel. I wouldn't want you sending money to an unverified account.";
      return nextTurn({ stage: state.stage, qualification: updatedQualification, priorityHandled: "question" }, response);
    }

    if (/\b(?:price\s+negotiable|can\s+they\s+reduce|discount|reduce\s+the\s+price|room\s+for\s+negotiation|lower\s+price)\b/i.test(textLower)) {
      const response = "Price negotiability depends on the seller and how the property is positioned in the market. I wouldn't promise a discount before an actual seller dialogue, but once we clarify your target property profile, I can help identify where negotiation leverage exists.";
      return nextTurn({ stage: state.stage, qualification: updatedQualification, priorityHandled: "question" }, response);
    }

    if (/\b(?:title|c\s+of\s+o|governor'?s\s+consent|gazette|survey|land\s+registry|lawyer|documents)\b/i.test(textLower)) {
      const response = "Title is one of the things I'd want verified before any major payment. Depending on the property, you may encounter documents such as C of O, Governor's Consent, Gazette, or registered survey. I'd have a property lawyer independently verify the documents and land registry records.";
      return nextTurn({ stage: state.stage, qualification: updatedQualification, priorityHandled: "question" }, response);
    }

    if (/\b(?:inspection\s+fee|pay\s+(?:for\s+)?inspection|fee\s+to\s+inspect)\b/i.test(textLower)) {
      const response = "I wouldn't pay an inspection fee simply because someone requested one. First confirm who you're dealing with, what you're being charged for, and whether the agent and property have been properly verified.";
      return nextTurn({ stage: state.stage, qualification: updatedQualification, priorityHandled: "question" }, response);
    }

    if (/\b(?:is\s+(?:this\s+property\s+|it\s+)?(?:still\s+)?available|available\s+now|units?\s+left)\b/i.test(textLower)) {
      const response = "If this system were connected to live brokerage inventory, I'd check real-time availability right now. For this demo, I focus on identifying the right property profile so an advisor can present active, verified listings.";
      return nextTurn({ stage: state.stage, qualification: updatedQualification, priorityHandled: "question" }, response);
    }

    if (/\b(?:flood|flooding|flooded|drainage|access\s+road|power|water|generator|service\s+charge)\b/i.test(textLower)) {
      const response = "Access roads, drainage, power management, and water treatment vary significantly across neighborhoods. That's why I prioritize properties in well-managed estates with verified infrastructure for serious buyers.";
      return nextTurn({ stage: state.stage, qualification: updatedQualification, priorityHandled: "question" }, response);
    }

    // PRIORITY 2: BUYER CORRECTION / CHANGE OF MIND
    if (extracted.isCorrection && extracted.propertyType) {
      const response = `Absolutely — I'll work with a ${extracted.propertyType} instead. That changes the options slightly, particularly around space and estate features. Do you still want to stay around your current budget range?`;
      return nextTurn({ stage: "budget", qualification: updatedQualification, priorityHandled: "correction" }, response);
    }

    // PRIORITY 3: HIGH-INTENT BUYING SIGNAL / INSPECTION REQUEST
    if (/\b(?:inspect\s+it|want\s+to\s+inspect|book\s+a?\s*viewing|see\s+the\s+property|schedule\s+inspection|inspect\s+tomorrow|make\s+an\s+offer)\b/i.test(textLower)) {
      const updatedState: ConversationState = {
        stage: "appointment",
        qualification: { ...updatedQualification, appointment: true, buyerReadiness: "ready_for_inspection" },
        priorityHandled: "buying_signal",
      };
      const response = "Absolutely. I can help you prepare what to check during the inspection — access roads, drainage, power and water arrangements, estate management, and document verification all matter. The actual appointment would still need confirmation from the advisor.";
      return nextTurn(updatedState, response);
    }

    // PRIORITY 4: PRICE OBJECTION OR COMPETITOR COMPARISON
    if (/\b(?:cheaper\s+option|another\s+agent|saw\s+cheaper)\b/i.test(textLower)) {
      const response = "That's worth looking into carefully. Before assuming it's a better deal, verify what title it has, what finishing is included, and whether there are hidden service charges or infrastructure costs after purchase. Would you like me to highlight what to compare?";
      return nextTurn({ stage: state.stage, qualification: updatedQualification, priorityHandled: "objection" }, response);
    }

    if (/\b(?:too\s+expensive|too\s+much|way\s+beyond|can't\s+afford|too\s+high)\b/i.test(textLower)) {
      const response = "I understand. Is ₦250m simply outside the range you're comfortable spending, or do you feel the property would need to offer more to justify that price? Those would lead us in two different directions.";
      return nextTurn({ stage: state.stage, qualification: updatedQualification, priorityHandled: "objection" }, response);
    }

    // PRIORITY 5: INTENT SHIFT (INVESTOR / BROWSING / FAMILY)
    if (extracted.buyerIntent === "investor" && state.qualification.buyerIntent !== "investor") {
      const parts = [
        "That changes how I'd approach the search.",
        "For an investment property, I wouldn't judge it mainly by how impressive the house looks.",
        "I'd want to understand rental demand, expected rent, acquisition cost and ongoing expenses first.",
      ];

      // Timing an investor gives is about capital, not occupancy — acknowledge
      // it as such rather than dropping it or asking when they plan to move.
      if (classifyTimelinePressure(updatedQualification.timeline) === "relaxed") {
        parts.push(
          "And since you're not under pressure to occupy anything, we can be selective on entry price rather than chasing whatever is ready.",
        );
      }

      const invBudget = concreteBudget(updatedQualification);
      const invWhere = updatedQualification.location;
      if (invBudget || invWhere) {
        parts.push(
          `Against ${invBudget ?? "your range"}${invWhere ? ` in ${invWhere}` : ""}, that means testing what the entry price competes with locally on rent and what the service charge does to the net position — not a projected yield.`,
        );
      }

      parts.push(
        "Are you mainly looking for steady rental income, long-term appreciation, or a combination of both?",
      );

      return nextTurn(
        { stage: "recommendation", qualification: updatedQualification, priorityHandled: "intent_shift" },
        parts.join(" "),
      );
    }

    if (extracted.buyerIntent === "browsing") {
      const parts = ["That's perfectly fine.", "You don't need to be ready to buy yet."];

      // Browsing stays browsing, but constraints the buyer has already given
      // should not be asked for again.
      const browseBudget = concreteBudget(updatedQualification);
      const browseWhere = updatedQualification.location;

      if (browseBudget && browseWhere) {
        parts.push(
          `Since you've mentioned ${browseBudget} around ${browseWhere}, I can walk you through the trade-offs that range usually forces — services and predictability against a lower headline price with less certainty — without pushing you toward a decision.`,
        );
      } else if (browseBudget) {
        parts.push(
          `Tell me which areas you're watching and I'll walk you through what that range usually has to trade off.`,
        );
      } else if (browseWhere) {
        parts.push(
          `Tell me roughly what you're comfortable spending and I'll walk you through what that usually has to trade off in ${browseWhere}.`,
        );
      } else {
        parts.push(
          "If you're comparing the market, tell me the area you're watching and roughly what you're comfortable spending.",
          "I'll help you understand what that budget is likely to buy and what trade-offs to watch for.",
        );
      }

      return nextTurn(
        { stage: "property-type", qualification: updatedQualification, priorityHandled: "intent_shift" },
        parts.join(" "),
      );
    }

    // PRIORITY 6: DECISION-MAKER / FAMILY OBJECTION ("Discuss with husband/wife/family")
    if (/\b(?:husband|wife|spouse|partner|family\s+first|discuss\s+with)\b/i.test(textLower)) {
      const response = "Of course. I wouldn't want you to rush that decision. When you discuss it, I'd suggest comparing the location, total purchase cost and how well the property fits what you both actually need. If it helps, I can also help you organize the key points you should compare.";
      return nextTurn({ stage: state.stage, qualification: updatedQualification, priorityHandled: "family_decision" }, response);
    }

    // PRIORITY 7: MULTI-ENTITY SINGLE TURN / FULL BRIEF (Recommend immediately)
    if (
      updatedQualification.propertyType &&
      updatedQualification.bedrooms &&
      updatedQualification.location &&
      updatedQualification.budget &&
      updatedQualification.timeline &&
      updatedQualification.financing
    ) {
      const response = buildRecommendation(updatedQualification);

      return nextTurn(
        { stage: "recommendation", qualification: updatedQualification, lastExtractedKeys: newlyExtractedKeys, priorityHandled: "full_brief" },
        response,
      );
    }

    // Explicit Recommendation Request Handler (Qualifies with "Based on what you've told me so far...")
    if (explicitRecommendationRequested) {
      const response = buildRecommendation(updatedQualification, { partial: true });

      return nextTurn(
        { stage: "recommendation", qualification: updatedQualification, lastExtractedKeys: newlyExtractedKeys, priorityHandled: "full_brief" },
        response,
      );
    }

    // PRIORITY 8: FALLBACK QUALIFICATION ROUTING
    // Corrected Fallback Order: propertyType -> bedrooms -> budget -> location -> timeline -> financing
    const nextStage = determineNextStage(updatedQualification, explicitRecommendationRequested);

    const updatedState: ConversationState = {
      stage: nextStage,
      qualification: updatedQualification,
      lastExtractedKeys: newlyExtractedKeys,
      priorityHandled: "discovery",
    };

    const replyText = this.buildConsultativeResponse(updatedState, content, extracted);
    return nextTurn(updatedState, replyText);
  }

  private buildConsultativeResponse(
    state: ConversationState,
    rawInput: string,
    extracted: ExtractedEntities,
  ): string {
    const q = state.qualification;
    const formattedBed = formatBedrooms(q.bedrooms);

    let ack = "";
    if (extracted.propertyType && extracted.location && extracted.budget) {
      ack = `A ${formattedBed ? formattedBed + " " : ""}${q.propertyType} in ${q.location} around ${q.budget} — that gives me a clear starting point. `;
    } else if (extracted.propertyType && extracted.location) {
      ack = `A ${formattedBed ? formattedBed + " " : ""}${q.propertyType} in ${q.location} — got it. `;
    } else if (extracted.propertyType) {
      ack = `A ${q.propertyType} — good. `;
    } else if (extracted.location) {
      ack = `Focusing around ${q.location} — understood. `;
    } else if (extracted.budget) {
      ack = `Working with ${q.budget} — that opens up solid possibilities. `;
    } else {
      ack = "Got it. ";
    }

    switch (state.stage) {
      case "property-type":
        return `${ack}What kind of home fits your goals best — an apartment, townhouse, or villa?`;

      case "bedrooms":
        return `${ack}How many bedrooms would suit your household best?`;

      case "budget":
        return `${ack}What budget range feels comfortable? That way I don't waste your time showing properties outside your range.`;

      case "location":
        return `${ack}Which areas are you prioritizing? Knowing your location focus helps filter out properties outside your target zone.`;

      case "timeline":
        return `${ack}That's helpful. If you're trying to move in the next 1–3 months, I'd be careful about anything with a long completion timeline. Are you looking to move soon, or exploring for later in the year?`;

      case "financing":
        return `${ack}One thing I'd want to clarify before narrowing this down is how you're planning to fund the purchase — outright cash or mortgage financing?`;

      case "recommendation": {
        const complete = Boolean(
          q.propertyType && q.bedrooms && q.budget && q.location && q.timeline && q.financing,
        );
        return buildRecommendation(q, { partial: !complete });
      }

      case "appointment":
        return "Excellent. I’ve captured your inspection request. A senior property advisor will reach out shortly to coordinate a time that fits your schedule. Would you also like the property portfolio PDF sent over?";

      default:
        return "I'm here to help narrow down the right options for you. What would be most useful to explore next?";
    }
  }

  private respondToAction(
    action: ConversationAction,
    state: ConversationState,
  ): ConversationTurn {
    if (action === "book-viewing") {
      const nextState: ConversationState = {
        ...state,
        stage: "appointment",
        qualification: { ...state.qualification, appointment: true, buyerReadiness: "ready_for_inspection" },
        priorityHandled: "buying_signal",
      };
      return nextTurn(
        nextState,
        "Wonderful — I’ve noted your interest in a private inspection. A property advisor will be in touch shortly to coordinate a time that fits your schedule.",
      );
    }

    if (action === "download-brochure") {
      return nextTurn(
        state,
        "I’ve prepared the property portfolio request. It includes listing details, floorplans, and location notes aligned with your brief.",
      );
    }

    return nextTurn(
      state,
      "Absolutely. I’ve flagged your brief for a senior human property advisor, who will follow up with personalized guidance.",
    );
  }
}
