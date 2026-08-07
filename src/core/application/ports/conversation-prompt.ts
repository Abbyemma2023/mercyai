export interface ConversationPrompt {
  employeeName: string;
  role: string;
  objective: string;
  guidelines: readonly string[];
}
