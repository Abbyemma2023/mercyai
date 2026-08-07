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
  | "timeline"
  | "financing"
  | "appointment";

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
}

export interface ConversationState {
  stage: ConversationStage;
  qualification: QualificationState;
}

export interface ConversationTurn {
  state: ConversationState;
  message: ConversationMessage;
}

export interface ConversationSnapshot {
  messages: ConversationMessage[];
  state: ConversationState;
}
