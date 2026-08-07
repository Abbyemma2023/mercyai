"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { ConversationMessage } from "@/core/domain/conversation";
import { EmployeeAvatar } from "./employee-avatar";
import { DemoIcon } from "./demo-icon";

function formatTime(timestamp: string) {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(timestamp));
}

function TypingIndicator() {
  return <div className="animate-message-in flex items-end gap-2"><EmployeeAvatar size="small" /><div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-[#e0e5dc] bg-white px-4 py-3" aria-label="Maya is typing"><span className="size-1.5 animate-bounce rounded-full bg-[#8d9b82] [animation-delay:-300ms]" /><span className="size-1.5 animate-bounce rounded-full bg-[#8d9b82] [animation-delay:-150ms]" /><span className="size-1.5 animate-bounce rounded-full bg-[#8d9b82]" /></div></div>;
}

export function ConversationPanel({ isTyping, messages, onSend }: { isTyping: boolean; messages: ConversationMessage[]; onSend: (message: string) => void }) {
  const [draft, setDraft] = useState("");
  const scrollAnchor = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollAnchor.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    if (!isTyping) input.current?.focus();
  }, [isTyping, messages]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || isTyping) return;
    setDraft("");
    onSend(message);
  }

  return <section aria-label="Conversation with Maya" className="flex min-h-[590px] flex-col overflow-hidden rounded-[24px] border border-[#dde2da] bg-[#f7f9f5] shadow-[0_18px_44px_rgba(33,43,28,0.08)]"><div className="flex items-center justify-between border-b border-[#e1e5de] bg-white/75 px-5 py-4"><div className="flex items-center gap-3"><EmployeeAvatar size="small" /><div><h2 className="text-sm font-semibold text-[#1f221f]">Maya</h2><p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#71806a]"><span className="size-1.5 rounded-full bg-[#82bf43]" />AI Sales Employee</p></div></div><span className="rounded-full bg-[#edf5e4] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#66853f]">Live demo</span></div><div role="log" aria-live="polite" aria-label="Conversation messages" className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6">{messages.map((message) => <div key={message.id} className={`animate-message-in flex gap-2 ${message.role === "user" ? "justify-end" : "items-end"}`}>{message.role === "assistant" ? <EmployeeAvatar size="small" /> : null}<div className={message.role === "assistant" ? "max-w-[80%]" : "max-w-[80%] text-right"}><p className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "assistant" ? "rounded-bl-sm border border-[#e1e6dd] bg-white text-[#444944]" : "rounded-br-sm bg-[#1b1e1c] text-white"}`}>{message.content}</p><time className="mt-1.5 block px-1 text-[10px] text-[#92968f]">{formatTime(message.createdAt)}</time></div></div>)}{isTyping ? <TypingIndicator /> : null}<div ref={scrollAnchor} /></div><form onSubmit={submit} className="border-t border-[#e1e5de] bg-white p-3"><label className="sr-only" htmlFor="demo-message">Message Maya</label><div className="flex items-center gap-2 rounded-xl border border-[#dce2d8] bg-[#fcfdfb] p-1.5 focus-within:border-[#a9c783] focus-within:ring-3 focus-within:ring-[#e5f2d3]"><input ref={input} id="demo-message" value={draft} onChange={(event) => setDraft(event.target.value)} disabled={isTyping} placeholder="Type your answer..." className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-sm text-[#292d29] outline-none placeholder:text-[#979c96] disabled:cursor-not-allowed" /><button type="submit" disabled={!draft.trim() || isTyping} className="grid size-9 place-items-center rounded-lg bg-[#1b1e1c] text-white transition-colors hover:bg-[#394138] disabled:cursor-not-allowed disabled:bg-[#d8ddd5]" aria-label="Send message"><DemoIcon name="send" className="size-4" /></button></div></form></section>;
}
