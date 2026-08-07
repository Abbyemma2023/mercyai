import type { ConversationEngine } from "@/core/application/ports/conversation-engine";
import { MockRealEstateConversationEngine } from "./mock-real-estate-conversation-engine";

export function createDemoConversationEngine(): ConversationEngine {
  return new MockRealEstateConversationEngine();
}
