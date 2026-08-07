"use client";

import { useRef, useState } from "react";
import type { ConversationEngine } from "@/core/application/ports/conversation-engine";
import type {
  ConversationAction,
  ConversationMessage,
  ConversationSnapshot,
} from "@/core/domain/conversation";
import { createDemoConversationEngine } from "@/infrastructure/conversation/create-demo-conversation-engine";

const actionLabels: Record<ConversationAction, string> = {
  "book-viewing": "I’d like to book a private viewing.",
  "download-brochure": "Please send me the brochure.",
  "talk-to-human": "I’d like to speak with a human advisor.",
};

function userMessage(content: string): ConversationMessage {
  return { id: crypto.randomUUID(), role: "user", content, createdAt: new Date().toISOString() };
}

function waitForReply() {
  return new Promise<void>((resolve) => window.setTimeout(resolve, 700));
}

export function useDemoConversation() {
  const engine = useRef<ConversationEngine | null>(null);
  const [snapshot, setSnapshot] = useState<ConversationSnapshot | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  function getEngine() {
    engine.current ??= createDemoConversationEngine();
    return engine.current;
  }

  async function start() {
    setIsTyping(true);
    await waitForReply();
    const turn = getEngine().start();
    setSnapshot({ messages: [turn.message], state: turn.state });
    setIsTyping(false);
  }

  async function respond(content: string, action?: ConversationAction) {
    if (!snapshot || isTyping) return;
    const nextUserMessage = userMessage(content);
    setSnapshot((current) => current ? { ...current, messages: [...current.messages, nextUserMessage] } : current);
    setIsTyping(true);
    await waitForReply();
    const turn = getEngine().respond(action ? { type: "action", action } : { type: "message", content }, snapshot.state);
    setSnapshot((current) => current ? { messages: [...current.messages, turn.message], state: turn.state } : current);
    setIsTyping(false);
  }

  async function restart() {
    if (isTyping) return;
    engine.current = createDemoConversationEngine();
    await start();
  }

  return {
    isStarted: snapshot !== null || isTyping,
    isTyping,
    messages: snapshot?.messages ?? [],
    state: snapshot?.state,
    restart,
    sendAction: (action: ConversationAction) => respond(actionLabels[action], action),
    sendMessage: (content: string) => respond(content),
    start,
  };
}
