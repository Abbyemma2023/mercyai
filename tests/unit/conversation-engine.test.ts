import assert from "node:assert";
import { test, describe } from "node:test";
import {
  MockRealEstateConversationEngine,
  extractEntities,
  determineNextStage,
  buildRecommendation,
  classifyTimelinePressure,
  classifyFinancing,
  recommendationLens,
} from "../../src/infrastructure/conversation/mock-real-estate-conversation-engine";
import type { QualificationState } from "../../src/core/domain/conversation";

describe("Maya Nigerian Real Estate AI Sales Employee - 30 Adversarial Unit Tests", () => {
  test("1. Four-field brief asks a useful next question (timeline) rather than recommending", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const respondTurn = engine.respond(
      { type: "message", content: "I'm looking for a 4-bedroom house in Lekki. My budget is around ₦250m." },
      startTurn.state,
    );

    assert.notStrictEqual(respondTurn.state.stage, "recommendation");
    assert.strictEqual(respondTurn.state.stage, "timeline");
    assert.match(respondTurn.message.content, /move in the next 1–3 months/i);
  });

  test("2. Five-field brief with timeline but no financing does NOT automatically recommend", () => {
    const state: QualificationState = {
      greeting: true,
      appointment: false,
      propertyType: "house",
      bedrooms: "4 bedrooms",
      budget: "₦250m",
      location: "Lekki",
      timeline: "1-3 months",
    };

    const nextStage = determineNextStage(state);
    assert.strictEqual(nextStage, "financing");
  });

  test("3. Five-field brief with financing but no timeline does NOT automatically recommend", () => {
    const state: QualificationState = {
      greeting: true,
      appointment: false,
      propertyType: "house",
      bedrooms: "4 bedrooms",
      budget: "₦250m",
      location: "Lekki",
      financing: "cash purchase",
    };

    const nextStage = determineNextStage(state);
    assert.strictEqual(nextStage, "timeline");
  });

  test("4. Full six-field brief can recommend", () => {
    const state: QualificationState = {
      greeting: true,
      appointment: false,
      propertyType: "detached villa",
      bedrooms: "4 bedrooms",
      budget: "₦350m",
      location: "Lekki Phase 1",
      timeline: "before December",
      financing: "pre-approved mortgage",
    };

    const nextStage = determineNextStage(state);
    assert.strictEqual(nextStage, "recommendation");
  });

  test("5. Explicit recommendation request can recommend even with incomplete fields", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const respondTurn = engine.respond(
      { type: "message", content: "What would you recommend for a 4-bedroom house in Lekki?" },
      startTurn.state,
    );

    assert.strictEqual(respondTurn.state.stage, "recommendation");
    assert.match(respondTurn.message.content, /based on what you've told me so far/i);
  });

  test("6. Negotiation question interrupts timeline routing", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const turn1 = engine.respond(
      { type: "message", content: "I'm looking for a 4-bedroom house in Lekki. My budget is around ₦250m." },
      startTurn.state,
    );

    const turn2 = engine.respond(
      { type: "message", content: "Is the price negotiable?" },
      turn1.state,
    );

    assert.match(turn2.message.content, /price negotiability depends on the seller/i);
    assert.doesNotMatch(turn2.message.content, /when are you hoping to move/i);
  });

  test("7. Title/C of O question interrupts qualification", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const turn1 = engine.respond(
      { type: "message", content: "What is the title? Is there C of O?" },
      startTurn.state,
    );

    assert.match(turn1.message.content, /title is one of the things I'd want verified/i);
    assert.doesNotMatch(turn1.message.content, /what budget range/i);
  });

  test("8. Inspection question interrupts qualification", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const turn1 = engine.respond(
      { type: "message", content: "Do I have to pay an inspection fee?" },
      startTurn.state,
    );

    assert.match(turn1.message.content, /wouldn't pay an inspection fee/i);
    assert.doesNotMatch(turn1.message.content, /what property type/i);
  });

  test("9. Price objection interrupts qualification", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const turn1 = engine.respond(
      { type: "message", content: "₦250m is too much for me." },
      startTurn.state,
    );

    assert.match(turn1.message.content, /is ₦250m simply outside the range/i);
    assert.doesNotMatch(turn1.message.content, /when are you hoping to move/i);
  });

  test("10. Husband/wife/family objection interrupts qualification", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const turn1 = engine.respond(
      { type: "message", content: "I need to discuss it with my husband first." },
      startTurn.state,
    );

    assert.match(turn1.message.content, /wouldn't want you to rush that decision/i);
    assert.doesNotMatch(turn1.message.content, /when are you hoping to move/i);
  });

  test("11. Investor intent changes strategy without immediately entering recommendation", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const turn1 = engine.respond(
      { type: "message", content: "I'm not buying for myself. I want something I can rent out." },
      startTurn.state,
    );

    assert.strictEqual(turn1.state.qualification.buyerIntent, "investor");
    assert.match(turn1.message.content, /changes how I'd approach the search/i);
    assert.match(turn1.message.content, /investment property/i);
    assert.doesNotMatch(turn1.message.content, /when are you hoping to move/i);
  });

  test("12. Browsing intent changes strategy without restarting the questionnaire", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const turn1 = engine.respond(
      { type: "message", content: "I'm just checking prices for now. I'm not ready to buy." },
      startTurn.state,
    );

    assert.strictEqual(turn1.state.qualification.buyerIntent, "browsing");
    assert.match(turn1.message.content, /perfectly fine/i);
    assert.match(turn1.message.content, /don't need to be ready to buy yet/i);
    assert.doesNotMatch(turn1.message.content, /what property type/i);
  });

  test("13. Property type correction overwrites the previous property type", () => {
    const currentState: QualificationState = {
      greeting: true,
      appointment: false,
      propertyType: "luxury villa",
      bedrooms: "4 bedrooms",
    };

    const extracted = extractEntities("Actually, make that a townhouse.", currentState);
    assert.strictEqual(extracted.propertyType, "townhouse");

    const updatedState: QualificationState = {
      ...currentState,
      ...(extracted.propertyType ? { propertyType: extracted.propertyType } : {}),
    };
    assert.strictEqual(updatedState.propertyType, "townhouse");
    assert.notStrictEqual(updatedState.propertyType, "luxury villa townhouse");
  });

  test("14. Budget correction overwrites the previous budget", () => {
    const currentState: QualificationState = { greeting: true, appointment: false, budget: "₦250m" };
    const extracted = extractEntities("Actually my budget is ₦180m.", currentState);
    assert.strictEqual(extracted.budget, "₦180m");
  });

  test("15. Location correction overwrites the previous location", () => {
    const currentState: QualificationState = { greeting: true, appointment: false, location: "Ajah" };
    const extracted = extractEntities("Let's make it Lekki Phase 1 instead.", currentState);
    assert.strictEqual(extracted.location, "Lekki Phase 1");
  });

  test("16. Bedroom correction overwrites the previous bedroom count", () => {
    const currentState: QualificationState = { greeting: true, appointment: false, bedrooms: "4 bedrooms" };
    const extracted = extractEntities("Actually, I only need 3 bedrooms.", currentState);
    assert.strictEqual(extracted.bedrooms, "3 bedrooms");
  });

  test("17. Multiple entities in one message are all extracted", () => {
    const state: QualificationState = { greeting: true, appointment: false };
    const input = "I need a 4-bedroom detached villa in Lekki Phase 1 around ₦350m for my family. We want to move before December and I'll be using a pre-approved mortgage.";

    const extracted = extractEntities(input, state);
    assert.strictEqual(extracted.propertyType, "detached villa");
    assert.strictEqual(extracted.bedrooms, "4 bedrooms");
    assert.strictEqual(extracted.location, "Lekki Phase 1");
    assert.strictEqual(extracted.budget, "₦350m");
    assert.strictEqual(extracted.timeline, "before December");
    assert.strictEqual(extracted.financing, "pre-approved mortgage");
    assert.strictEqual(extracted.buyerIntent, "end-user");
  });

  test("18. Raw user sentence is never stored as a qualification value", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const respondTurn = engine.respond(
      { type: "message", content: "I'm looking for a 4-bedroom luxury villa in Lekki around ₦250m." },
      startTurn.state,
    );

    assert.strictEqual(respondTurn.state.qualification.propertyType, "luxury villa");
    assert.notStrictEqual(
      respondTurn.state.qualification.propertyType,
      "I'm looking for a 4-bedroom luxury villa in Lekki around ₦250m.",
    );
  });

  test("19. No repeated timeline question after the buyer asks another question", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const turn1 = engine.respond(
      { type: "message", content: "I'm looking for a 4-bedroom house in Lekki. My budget is around ₦250m." },
      startTurn.state,
    );
    assert.strictEqual(turn1.state.stage, "timeline");

    const turn2 = engine.respond(
      { type: "message", content: "What is the title? Is there C of O?" },
      turn1.state,
    );

    assert.doesNotMatch(turn2.message.content, /when are you hoping to move/i);
  });

  test("20. No fabricated live inventory", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const respondTurn = engine.respond(
      { type: "message", content: "Show me available villas in Lekki Phase 1." },
      startTurn.state,
    );

    assert.doesNotMatch(respondTurn.message.content, /I have two villas available/i);
    assert.doesNotMatch(respondTurn.message.content, /Unit 4B/i);
  });

  test("21. No fake inspection confirmation", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const respondTurn = engine.respond(
      { type: "message", content: "Can I inspect tomorrow?" },
      startTurn.state,
    );

    assert.doesNotMatch(respondTurn.message.content, /your inspection is confirmed/i);
    assert.match(respondTurn.message.content, /actual appointment would still need confirmation/i);
  });

  test("22. No fabricated title information", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const respondTurn = engine.respond(
      { type: "message", content: "Does this villa have a clean C of O?" },
      startTurn.state,
    );

    assert.doesNotMatch(respondTurn.message.content, /the C of O is clean/i);
    assert.match(respondTurn.message.content, /independently verify/i);
  });

  test("23. No unsafe payment request", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const respondTurn = engine.respond(
      { type: "message", content: "Send me the account number so I can pay." },
      startTurn.state,
    );

    assert.match(respondTurn.message.content, /authorized advisor or official company channel/i);
    assert.doesNotMatch(respondTurn.message.content, /transfer funds now/i);
  });

  test("24. No password/OTP/PIN/card request", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const respondTurn = engine.respond(
      { type: "message", content: "How do I process payment?" },
      startTurn.state,
    );

    assert.doesNotMatch(respondTurn.message.content, /enter your pin/i);
    assert.doesNotMatch(respondTurn.message.content, /provide card details/i);
  });

  test("25. Investor rental question does not invent ROI", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const respondTurn = engine.respond(
      { type: "message", content: "What is the expected rental yield on this investment?" },
      startTurn.state,
    );

    assert.doesNotMatch(respondTurn.message.content, /10% rental yield guaranteed/i);
    assert.doesNotMatch(respondTurn.message.content, /20% ROI guaranteed/i);
  });

  test("26. Browsing buyer is not pressured", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const respondTurn = engine.respond(
      { type: "message", content: "I'm only browsing for now." },
      startTurn.state,
    );

    assert.match(respondTurn.message.content, /don't need to be ready to buy yet/i);
    assert.doesNotMatch(respondTurn.message.content, /you must book a viewing today/i);
  });

  test("27. 'Can I inspect tomorrow?' is recognized as a buying signal", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const respondTurn = engine.respond(
      { type: "message", content: "Can I inspect tomorrow?" },
      startTurn.state,
    );

    assert.strictEqual(respondTurn.state.stage, "appointment");
    assert.match(respondTurn.message.content, /prepare what to check during the inspection/i);
  });

  test("28. 'Actually, make that a townhouse' preserves unrelated state", () => {
    const currentState: QualificationState = {
      greeting: true,
      appointment: false,
      propertyType: "villa",
      bedrooms: "4 bedrooms",
      location: "Lekki Phase 1",
      budget: "₦300m",
    };

    const extracted = extractEntities("Actually, make that a townhouse.", currentState);
    assert.strictEqual(extracted.propertyType, "townhouse");

    const updatedState: QualificationState = {
      ...currentState,
      ...(extracted.propertyType ? { propertyType: extracted.propertyType } : {}),
    };

    assert.strictEqual(updatedState.propertyType, "townhouse");
    assert.strictEqual(updatedState.bedrooms, "4 bedrooms");
    assert.strictEqual(updatedState.location, "Lekki Phase 1");
    assert.strictEqual(updatedState.budget, "₦300m");
  });

  test("29. 'The price is too high' is treated as an objection rather than a timeline response", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const respondTurn = engine.respond(
      { type: "message", content: "The price is too high for me." },
      startTurn.state,
    );

    assert.match(respondTurn.message.content, /is ₦250m simply outside the range/i);
    assert.doesNotMatch(respondTurn.message.content, /when are you hoping to move/i);
  });

  test("30. 'I need to discuss it with my husband' is handled as a decision-maker concern", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const respondTurn = engine.respond(
      { type: "message", content: "I need to discuss it with my husband." },
      startTurn.state,
    );

    assert.match(respondTurn.message.content, /wouldn't want you to rush that decision/i);
    assert.doesNotMatch(respondTurn.message.content, /what property type/i);
  });
});

// =============================================================================
// ATOMIC UNIT 2 — RECOMMENDATION SYNTHESIS & CONSTRAINT FIDELITY
//
// The engine already captured the buyer's constraints correctly. These tests
// pin the next behaviour: the recommendation has to *reason from* them, not
// recite them — while still inventing no inventory, title, dates or returns.
// =============================================================================

/** Six-field family brief with a hard move-in date and pre-approved financing. */
function familyDeadlineState(): QualificationState {
  return {
    greeting: true,
    appointment: false,
    propertyType: "detached villa",
    bedrooms: "4 bedrooms",
    budget: "₦350m",
    location: "Lekki Phase 1",
    timeline: "before December",
    financing: "pre-approved mortgage",
    buyerIntent: "end-user",
    buyerMotivation: "family_home",
  };
}

/** Same buyer, cash instead of a mortgage and no deadline. */
function familyCashRelaxedState(): QualificationState {
  return {
    ...familyDeadlineState(),
    timeline: "exploring options",
    financing: "cash purchase",
  };
}

function investorState(): QualificationState {
  return {
    greeting: true,
    appointment: false,
    propertyType: "apartment",
    bedrooms: "3 bedrooms",
    budget: "₦180m",
    location: "Lekki",
    timeline: "exploring options",
    financing: "cash purchase",
    buyerIntent: "investor",
    buyerMotivation: "rental_yield",
  };
}

/** Splits on sentence punctuation followed by whitespace, so "₦3.5m" survives. */
function sentenceCount(text: string): number {
  return text.split(/[.?!]+(?:\s+|$)/).filter((s) => s.trim().length > 0).length;
}

function sentenceContaining(text: string, needle: string): string {
  const sentence = text
    .split(/(?<=[.?!])\s+/)
    .find((s) => s.includes(needle));
  assert.ok(sentence, `expected a sentence containing "${needle}" in:\n${text}`);
  return sentence;
}

/** Claims the engine can never support — no inventory, registry or market feed. */
function assertMakesNoUnsupportedClaims(content: string) {
  assert.doesNotMatch(content, /\bi (?:found|have|located)\b[^.?!]*\b(?:propert|villa|apartment|unit|listing)/i);
  assert.doesNotMatch(content, /\b(?:there are|we have)\b[^.?!]*\b(?:available|in stock|units? left)/i);
  assert.doesNotMatch(content, /\bis (?:still )?available\b/i);
  assert.doesNotMatch(content, /\b(?:has|comes with|holds)\b[^.?!]*\bc of o\b/i);
  assert.doesNotMatch(content, /\btitle is clean\b/i);
  assert.doesNotMatch(content, /\bwill be (?:completed|delivered|ready|handed over)\b/i);
  assert.doesNotMatch(content, /\bcompletion date is\b/i);
  assert.doesNotMatch(content, /\bwill appreciate\b/i);
  assert.doesNotMatch(content, /\bguaranteed\b/i);
  assert.doesNotMatch(content, /\d+\s*%/);
  assert.doesNotMatch(content, /\byour (?:viewing|inspection|appointment) is (?:confirmed|booked)\b/i);
}

/** Questions that belong to discovery, not to a recommendation. */
function assertAppendsNoQualificationQuestion(content: string) {
  assert.doesNotMatch(content, /what kind of home fits your goals/i);
  assert.doesNotMatch(content, /how many bedrooms/i);
  assert.doesNotMatch(content, /what budget range/i);
  assert.doesNotMatch(content, /which areas are you prioritizing/i);
  assert.doesNotMatch(content, /when are you hoping to move/i);
  assert.doesNotMatch(content, /outright cash or mortgage financing/i);
}

describe("Maya — Recommendation Synthesis & Constraint Fidelity", () => {
  test("31. Full six-field family brief uses the timeline in its reasoning", () => {
    const content = buildRecommendation(familyDeadlineState());

    assert.match(content, /before December/);
    // The timeline must drive a search decision, not just be named.
    assert.match(content, /completed or near-completion/i);
    assert.match(content, /handover/i);
  });

  test("32. Full six-field family brief uses financing context when relevant", () => {
    const content = buildRecommendation(familyDeadlineState());

    assert.match(content, /pre-approved/i);
    assert.match(content, /title and transaction structure/i);
  });

  test("33. Full six-field investor brief produces investor-specific reasoning", () => {
    const content = buildRecommendation(investorState());

    assert.match(content, /income purchase/i);
    assert.match(content, /tenant demand/i);
    assert.match(content, /service charge/i);
    // And not the occupier framing.
    assert.doesNotMatch(content, /move-in planning/i);
  });

  test("34. Investor recommendation never frames timing as the investor moving in", () => {
    const withDeadline: QualificationState = { ...investorState(), timeline: "within 3 months" };
    const content = buildRecommendation(withDeadline);

    assert.match(content, /within 3 months/);
    assert.match(content, /capital working/i);
    assert.doesNotMatch(content, /\bmove in\b/i);
    assert.doesNotMatch(content, /\bmoving in\b/i);
    assert.doesNotMatch(content, /when are you hoping to move/i);
    assert.doesNotMatch(content, /your family/i);
  });

  test("35. Budget is used as a constraint, not merely copied into a sentence", () => {
    const content = buildRecommendation(familyDeadlineState());
    const budgetSentence = sentenceContaining(content, "₦350m");

    // The sentence carrying the figure must be the one framing the trade-off.
    assert.match(budgetSentence, /trade-off/i);
    assert.match(budgetSentence, /Lekki Phase 1/);
    // Never a market-price or affordability claim.
    assert.doesNotMatch(content, /₦350m is enough/i);
    assert.doesNotMatch(content, /you can definitely get/i);
    assert.doesNotMatch(content, /the market price is/i);
  });

  test("36. Timeline changes the recommendation direction", () => {
    const deadline = buildRecommendation(familyDeadlineState());
    const relaxed = buildRecommendation({
      ...familyDeadlineState(),
      timeline: "exploring options",
    });

    assert.notStrictEqual(deadline, relaxed);
    assert.match(deadline, /completed or near-completion/i);
    assert.doesNotMatch(relaxed, /completed or near-completion/i);
    assert.match(relaxed, /no fixed deadline|no date to hit/i);
  });

  test("37. 'Before December' produces completion-certainty reasoning", () => {
    assert.strictEqual(classifyTimelinePressure("before December"), "deadline");

    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();
    const turn = engine.respond(
      {
        type: "message",
        content:
          "I need a 4-bedroom detached villa in Lekki Phase 1 around ₦350m for my family. We want to move before December and I'll be using a pre-approved mortgage.",
      },
      startTurn.state,
    );

    assert.strictEqual(turn.state.stage, "recommendation");
    assert.match(turn.message.content, /completed or near-completion/i);
    assert.match(turn.message.content, /uncertain handover date/i);
  });

  test("38. 'No rush' does not manufacture urgency", () => {
    assert.strictEqual(classifyTimelinePressure("exploring options"), "relaxed");

    const content = buildRecommendation(familyCashRelaxedState());
    assert.doesNotMatch(
      content,
      /\b(?:urgent|urgency|act fast|act now|hurry|limited time|selling fast|before it goes|don't miss|move quickly)\b/i,
    );
    assert.match(content, /rather wait for the right property/i);
  });

  test("39. Pre-approved mortgage makes no unsupported lender claims", () => {
    const content = buildRecommendation(familyDeadlineState());

    assert.doesNotMatch(content, /you (?:qualify|are approved) for/i);
    assert.doesNotMatch(content, /interest rate/i);
    assert.doesNotMatch(content, /loan amount/i);
    assert.doesNotMatch(content, /your lender will/i);
    assert.doesNotMatch(content, /disbursement/i);
    assert.doesNotMatch(content, /\d+\s*%/);
  });

  test("40. Cash buyer gets no mortgage-oriented reasoning", () => {
    assert.strictEqual(classifyFinancing("cash purchase"), "cash");

    const content = buildRecommendation(familyCashRelaxedState());
    assert.doesNotMatch(content, /mortgage/i);
    assert.doesNotMatch(content, /lender/i);
    assert.doesNotMatch(content, /pre-approv/i);
    assert.match(content, /paying cash/i);
  });

  test("41. Recommendations claim no live inventory, title, dates, yield or booking", () => {
    for (const state of [familyDeadlineState(), familyCashRelaxedState(), investorState()]) {
      assertMakesNoUnsupportedClaims(buildRecommendation(state));
      assertMakesNoUnsupportedClaims(buildRecommendation(state, { partial: true }));
    }
  });

  test("42. Recommendations route verification rather than asserting facts", () => {
    const family = buildRecommendation(familyDeadlineState());
    assert.match(family, /independently verified/i);
    assert.match(family, /title/i);

    const investor = buildRecommendation(investorState());
    assert.match(investor, /verified/i);
    assert.match(investor, /wouldn't work from a projected yield/i);
  });

  test("43. Recommendation appends no unrelated qualification question", () => {
    for (const state of [familyDeadlineState(), familyCashRelaxedState(), investorState()]) {
      const content = buildRecommendation(state);
      assertAppendsNoQualificationQuestion(content);
      // Exactly one next step, and it is about the trade-off.
      assert.strictEqual((content.match(/\?/g) ?? []).length, 1);
    }
  });

  test("44. Explicit recommendation request qualifies itself with what is known", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const turn1 = engine.respond(
      { type: "message", content: "I'm looking for a 4-bedroom house in Lekki. My budget is around ₦250m." },
      startTurn.state,
    );
    const turn2 = engine.respond(
      { type: "message", content: "What would you recommend based on what I've told you so far?" },
      turn1.state,
    );

    assert.strictEqual(turn2.state.stage, "recommendation");
    assert.match(turn2.message.content, /^Based on what you've told me so far,/);
    assert.match(turn2.message.content, /₦250m/);
    assert.match(turn2.message.content, /Lekki/);
    // Nothing was said about timing or financing, so nothing is asserted about them.
    assert.doesNotMatch(turn2.message.content, /mortgage|paying cash/i);
    assertMakesNoUnsupportedClaims(turn2.message.content);
  });

  test("45. Buyer purpose changes the recommendation", () => {
    const family = buildRecommendation(familyDeadlineState());
    const investor = buildRecommendation({
      ...familyDeadlineState(),
      buyerIntent: "investor",
      buyerMotivation: "rental_yield",
    });

    assert.notStrictEqual(family, investor);
    assert.match(family, /your family/i);
    assert.match(family, /move-in planning for a family/i);
    assert.match(investor, /income purchase rather than a home/i);
    assert.doesNotMatch(investor, /your family/i);
    assert.strictEqual(recommendationLens(investorState()), "investor");
  });

  test("46. Recommendation stays selective rather than dumping property concerns", () => {
    const content = buildRecommendation(familyDeadlineState());

    // The buyer raised none of these, so none of them belong in the answer.
    assert.doesNotMatch(content, /flood|drainage|generator|borehole|omo onile|land grabber/i);
    const sentences = sentenceCount(content);
    assert.ok(sentences >= 3 && sentences <= 6, `expected 3-6 sentences, got ${sentences}`);
  });

  test("47. Every recommendation shape stays within 3-6 sentences", () => {
    const shapes: QualificationState[] = [
      familyDeadlineState(),
      familyCashRelaxedState(),
      investorState(),
      { ...investorState(), timeline: "within 3 months", financing: "pre-approved mortgage" },
      { greeting: true, appointment: false, propertyType: "house", location: "Ikoyi" },
    ];

    for (const state of shapes) {
      for (const partial of [false, true]) {
        const count = sentenceCount(buildRecommendation(state, { partial }));
        assert.ok(count >= 3 && count <= 6, `expected 3-6 sentences, got ${count}`);
      }
    }
  });

  // --- Adversarial cases ----------------------------------------------------

  test("48. ADVERSARIAL: the full family brief reflects every material constraint", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const turn = engine.respond(
      {
        type: "message",
        content:
          "I need a 4-bedroom detached villa in Lekki Phase 1 around ₦350m for my family. We want to move before December and I'll be using a pre-approved mortgage.",
      },
      startTurn.state,
    );

    const content = turn.message.content;

    assert.match(content, /4-bedroom/);
    assert.match(content, /detached villa/);
    assert.match(content, /Lekki Phase 1/);
    assert.match(content, /₦350m/);
    assert.match(content, /your family/i);
    assert.match(content, /before December/);
    assert.match(content, /pre-approved/i);

    // Reasoning, not recital.
    assert.match(content, /completed or near-completion/i);
    assert.match(content, /title and transaction structure/i);
    assert.match(content, /trade-off/i);

    assertMakesNoUnsupportedClaims(content);
    assertAppendsNoQualificationQuestion(content);
  });

  test("49. ADVERSARIAL: investor with no occupancy need is never asked when they will move", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const turn = engine.respond(
      {
        type: "message",
        content:
          "I'm looking for a 3-bedroom apartment in Lekki around ₦180m. I'm buying for rental income and I don't need to move anytime soon.",
      },
      startTurn.state,
    );

    assert.strictEqual(turn.state.qualification.buyerIntent, "investor");
    assert.doesNotMatch(turn.message.content, /when are you hoping to move/i);
    assert.doesNotMatch(turn.message.content, /\bmove in\b/i);

    // Investment economics, and the stated timing read as capital rather than occupancy.
    assert.match(turn.message.content, /rental demand/i);
    assert.match(turn.message.content, /not under pressure to occupy/i);
    assert.match(turn.message.content, /₦180m/);
    assert.match(turn.message.content, /service charge/i);
    assertMakesNoUnsupportedClaims(turn.message.content);
  });

  test("50. ADVERSARIAL: a large budget does not override browsing intent", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const turn = engine.respond(
      {
        type: "message",
        content: "I'm just checking prices. I have about ₦500m available but I'm not ready to buy.",
      },
      startTurn.state,
    );

    assert.strictEqual(turn.state.qualification.buyerIntent, "browsing");
    assert.strictEqual(turn.state.qualification.buyerReadiness, "browsing");
    assert.notStrictEqual(turn.state.stage, "recommendation");
    assert.match(turn.message.content, /don't need to be ready to buy yet/i);
    assert.doesNotMatch(turn.message.content, /book (?:a|an) (?:viewing|inspection)/i);
    assert.doesNotMatch(turn.message.content, /\b(?:urgent|act fast|act now|hurry|limited time)\b/i);
  });

  test("51. ADVERSARIAL: browsing stays dominant once the brief is complete", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const turn1 = engine.respond(
      {
        type: "message",
        content: "I'm just checking prices. I have about ₦500m available but I'm not ready to buy.",
      },
      startTurn.state,
    );
    const turn2 = engine.respond(
      {
        type: "message",
        content: "A 4-bedroom detached villa in Lekki Phase 1, before December, pre-approved mortgage.",
      },
      turn1.state,
    );

    assert.strictEqual(turn2.state.qualification.buyerIntent, "browsing");
    // A complete brief may reach the recommendation stage, but the tone stays comparative.
    assert.match(turn2.message.content, /comparing rather than buying/i);
    assert.doesNotMatch(turn2.message.content, /binding constraint/i);
    assert.doesNotMatch(turn2.message.content, /\b(?:urgent|act fast|act now|hurry|limited time)\b/i);
    assertMakesNoUnsupportedClaims(turn2.message.content);
  });

  test("52. ADVERSARIAL: the no-rush explorer gets orientation, not pressure", () => {
    const engine = new MockRealEstateConversationEngine();
    const startTurn = engine.start();

    const turn = engine.respond(
      {
        type: "message",
        content: "I need a 4-bedroom house in Lekki around ₦250m. There's no rush; I'm just exploring.",
      },
      startTurn.state,
    );

    const content = turn.message.content;
    assert.match(content, /perfectly fine/i);
    assert.doesNotMatch(
      content,
      /\b(?:urgent|urgency|act fast|act now|hurry|limited time|selling fast|before it goes)\b/i,
    );
    // Constraints already given are used, not asked for again.
    assert.match(content, /₦250m/);
    assert.match(content, /Lekki/);
    assert.doesNotMatch(content, /which areas are you prioritizing/i);
    assert.doesNotMatch(content, /what budget range/i);
  });

  test("53. Timeline and financing classifiers are deterministic", () => {
    assert.strictEqual(classifyTimelinePressure(undefined), "unspecified");
    assert.strictEqual(classifyTimelinePressure("before December"), "deadline");
    assert.strictEqual(classifyTimelinePressure("this year"), "deadline");
    assert.strictEqual(classifyTimelinePressure("immediately"), "near-term");
    assert.strictEqual(classifyTimelinePressure("within 3 months"), "near-term");
    assert.strictEqual(classifyTimelinePressure("in 2 years"), "relaxed");
    assert.strictEqual(classifyTimelinePressure("no rush"), "relaxed");
    assert.strictEqual(classifyTimelinePressure("exploring options"), "relaxed");

    assert.strictEqual(classifyFinancing(undefined), "unspecified");
    assert.strictEqual(classifyFinancing("pre-approved mortgage"), "mortgage-ready");
    assert.strictEqual(classifyFinancing("cash purchase"), "cash");
  });
});
