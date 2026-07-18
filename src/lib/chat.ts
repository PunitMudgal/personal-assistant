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

/**
 * Split finished reasoning into chain-of-thought steps.
 * Returns [] when there are fewer than 2 clear steps.
 */
export function getReasoningSteps(text: string): { title: string; body: string }[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const headingSplit = trimmed.split(/(?=^#{1,3}\s+.+$)/m).filter(Boolean);
  if (headingSplit.length >= 2) {
    return headingSplit.map((chunk) => {
      const lines = chunk.trim().split("\n");
      const title = lines[0]?.replace(/^#{1,3}\s+/, "").trim() || "Step";
      const body = lines.slice(1).join("\n").trim();
      return { title, body };
    });
  }

  const stepSplit = trimmed.split(/(?=^(?:\*\*)?Step\s+\d+)/im).filter(Boolean);
  if (stepSplit.length >= 2) {
    return stepSplit.map((chunk, index) => {
      const lines = chunk.trim().split("\n");
      const title =
        lines[0]
          ?.replace(/^\*\*/, "")
          .replace(/\*\*$/, "")
          .trim() || `Step ${index + 1}`;
      const body = lines.slice(1).join("\n").trim();
      return { title, body };
    });
  }

  return [];
}

/** Show ThinkingBar when the model is working but assistant text has not started. */
export function shouldShowThinkingBar(
  messages: UIMessage[],
  isBusy: boolean,
): boolean {
  if (!isBusy) return false;

  const last = messages[messages.length - 1];
  if (!last) return true;
  if (last.role === "user") return true;
  if (last.role === "assistant" && !getMessageText(last)) return true;
  return false;
}

export function isChatBusy(
  status: "submitted" | "streaming" | "ready" | "error",
): boolean {
  return status === "submitted" || status === "streaming";
}
