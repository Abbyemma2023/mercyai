export type MessageRole = "assistant" | "user";

export type ConversationStage =
  | "property-type"
  | "budget"
  | "location"
  | "bedrooms"
  | "timeline"
  | "financing"
  | "recommendation"
  | "appointment";

export type ConversationAction =
  | "book-viewing"
  | "download-brochure"
  | "talk-to-human";

export type ConversationEvent =
  | { type: "message"; content: string }
  | { type: "action"; action: ConversationAction };

export type QualificationKey =
  | "greeting"
  | "budget"
  | "propertyType"
  | "location"
  | "bedrooms"
  | "timeline"
  | "financing"
  | "appointment";

export type BuyerIntent = "end-user" | "investor" | "browsing" | "undecided";

export type BuyerMotivation =
  | "family_home"
  | "rental_yield"
  | "capital_growth"
  | "relocation"
  | "upgrade"
  | "browsing";

export type BuyerReadiness =
  | "browsing"
  | "exploring"
  | "interested"
  | "serious"
  | "high_intent"
  | "ready_for_inspection";

export type PriorityHandled =
  | "question"
  | "correction"
  | "buying_signal"
  | "objection"
  | "intent_shift"
  | "family_decision"
  | "full_brief"
  | "discovery";

export interface ConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface QualificationState {
  greeting: boolean;
  propertyType?: string;
  budget?: string;
  location?: string;
  bedrooms?: string;
  timeline?: string;
  financing?: string;
  appointment: boolean;
  buyerIntent?: BuyerIntent;
  buyerMotivation?: BuyerMotivation;
  buyerReadiness?: BuyerReadiness;
  lastObjectionAnswered?: string;
  pendingQuestionDiscarded?: boolean;
}

export interface ConversationState {
  stage: ConversationStage;
  qualification: QualificationState;
  lastExtractedKeys?: QualificationKey[];
  priorityHandled?: PriorityHandled;
}

export interface ConversationTurn {
  state: ConversationState;
  message: ConversationMessage;
}

export interface ConversationSnapshot {
  messages: ConversationMessage[];
  state: ConversationState;
}
