import type { ConversationEngine } from "@/core/application/ports/conversation-engine";
import type {
  ConversationAction,
  ConversationEvent,
  ConversationMessage,
  ConversationState,
  ConversationTurn,
} from "@/core/domain/conversation";

const initialState: ConversationState = {
  stage: "property-type",
  qualification: { greeting: true, appointment: false },
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

export class MockRealEstateConversationEngine implements ConversationEngine {
  start(): ConversationTurn {
    return nextTurn(
      initialState,
      "Hi, I’m Maya, your AI Sales Employee. I’ll help you find a home that fits what matters to you. What kind of property are you looking for—an apartment, townhouse, or villa?",
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
    const qualification = state.qualification;

    switch (state.stage) {
      case "property-type":
        return nextTurn(
          { stage: "budget", qualification: { ...qualification, propertyType: content } },
          `That sounds like a great fit. What budget range would feel comfortable for your ${content.toLowerCase()}?`,
        );
      case "budget":
        return nextTurn(
          { stage: "location", qualification: { ...qualification, budget: content } },
          "Perfect. Which neighbourhoods or areas are you most interested in?",
        );
      case "location":
        return nextTurn(
          { stage: "bedrooms", qualification: { ...qualification, location: content } },
          `I’ll focus my search around ${content}. How many bedrooms would suit your household best?`,
        );
      case "bedrooms":
        return nextTurn(
          { stage: "timeline", qualification: { ...qualification, bedrooms: content } },
          "Thank you. When would you ideally like to make your move?",
        );
      case "timeline":
        return nextTurn(
          { stage: "financing", qualification: { ...qualification, timeline: content } },
          "One last detail so I can guide you well: are you planning a cash purchase or using a mortgage?",
        );
      case "financing":
        return nextTurn(
          { stage: "recommendation", qualification: { ...qualification, financing: content } },
          `I have two promising ${qualification.propertyType ?? "home"} options in ${qualification.location ?? "your preferred area"} that align with your ${qualification.bedrooms ?? "ideal"} bedroom preference and budget. Would you like me to arrange a private viewing?`,
        );
      case "recommendation":
        return nextTurn(
          { stage: "appointment", qualification: { ...qualification, appointment: true } },
          "Excellent. I’ve noted your interest in a private viewing. A member of the team will confirm a time that works for you shortly. Would you also like the brochure while you wait?",
        );
      case "appointment":
        return nextTurn(
          state,
          "I’m here to make the next step easy. You can request a brochure, speak with a human advisor, or tell me anything else that would help narrow the options.",
        );
    }
  }

  private respondToAction(
    action: ConversationAction,
    state: ConversationState,
  ): ConversationTurn {
    if (action === "book-viewing") {
      if (state.stage !== "recommendation" && state.stage !== "appointment") {
        return nextTurn(state, "I’d love to arrange that. First, let me understand the kind of home you have in mind so I can make the viewing worthwhile.");
      }

      return nextTurn(
        { stage: "appointment", qualification: { ...state.qualification, appointment: true } },
        "Wonderful—I’ve captured your request for a private viewing. A property advisor will be in touch to confirm a time that suits you.",
      );
    }

    if (action === "download-brochure") {
      return nextTurn(state, "I’ve prepared the brochure request. It includes the recommended homes, location notes, and next steps for your search.");
    }

    return nextTurn(state, "Absolutely. I’ve flagged this conversation for a human property advisor, who can help with the details that need a personal touch.");
  }
}
