import {
  isReasoningUIPart,
  isTextUIPart,
  type UIMessage,
} from "ai";

/** UI message type used by useChat + our /api/chat stream (incl. sidebar refresh data). */
export type ChatUIMessage = UIMessage<
  never,
  {
    "frontend-action": "refresh-sidebar";
  }
>;

/** Join all text parts of a message into one string. */
export function getMessageText(message: UIMessage): string {
  return message.parts
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join("");
}

/** Join reasoning parts; null when the message has none. */
export function getMessageReasoning(message: UIMessage): {
  text: string;
  isStreaming: boolean;
} | null {
  const parts = message.parts.filter(isReasoningUIPart);
  if (parts.length === 0) return null;

  return {
    text: parts.map((part) => part.text).join(""),
    isStreaming: parts.some((part) => part.state === "streaming"),
  };
}

export function isChatBusy(
  status: "submitted" | "streaming" | "ready" | "error",
): boolean {
  return status === "submitted" || status === "streaming";
}
