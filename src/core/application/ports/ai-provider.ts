import type {
  ConversationEvent,
  ConversationState,
  ConversationTurn,
} from "@/core/domain/conversation";
import type { ConversationPrompt } from "./conversation-prompt";

export interface AIProviderRequest {
  prompt: ConversationPrompt;
  event: ConversationEvent;
  state: ConversationState;
}

export interface AIProvider {
  generateReply(request: AIProviderRequest): Promise<ConversationTurn>;
}
