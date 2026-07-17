import type { ModelOption } from "@/lib/types";

export const mockModels: ModelOption[] = [
  {
    id: "gemini-3.5-flash",
    name: "Gemini 3.5 Flash",
    description: "Fast and capable — default",
  },
  {
    id: "gemma-4-31b",
    name: "Gemma 4 31B",
    description: "Open model via OpenRouter",
  },
  {
    id: "llama-3.3-70b",
    name: "Llama 3.3 70B",
    description: "Great for summaries",
  },
];

export const defaultModelId = mockModels[0].id;
