export type Conversation = {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  favourite: boolean;
};

export type MessageRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  reasoning?: string;
};

export type UserProfile = {
  name: string;
  email: string;
  initials: string;
};

export type PromptSuggestion = {
  id: string;
  label: string;
  highlight?: string;
};

export type ModelOption = {
  id: string;
  name: string;
  description: string;
};
