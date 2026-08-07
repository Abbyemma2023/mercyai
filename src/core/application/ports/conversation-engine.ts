import type {
  ConversationEvent,
  ConversationState,
  ConversationTurn,
} from "@/core/domain/conversation";

export interface ConversationEngine {
  start(): ConversationTurn;
  respond(event: ConversationEvent, state: ConversationState): ConversationTurn;
}
