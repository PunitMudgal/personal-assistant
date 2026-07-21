import { primaryProvider } from "../../../../models";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  safeValidateUIMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import {
  getChatById,
  createChat,
  appendToChatMessages,
  updateChat,
} from "@/db/queries";
import { generateTitle } from "./generate-title";
import { createSearchTool } from "./search-tool";

export const maxDuration = 30;

export type MyMessage = UIMessage<
  never,
  {
    "frontend-action": "refresh-sidebar";
  }
>;

export async function POST(req: Request) {
  const body: { messages: UIMessage[]; id: string; userId: string } =
    await req.json();
  const chatId = body.id;
  const userId = body.userId;

  if (!userId) {
    return new Response(JSON.stringify({ error: "userId is required" }), {
      status: 401,
    });
  }

  const validatedMessagesResult = await safeValidateUIMessages<MyMessage>({
    messages: body.messages,
  });
  if (!validatedMessagesResult.success) {
    return new Response(
      JSON.stringify({ error: validatedMessagesResult.error }),
      { status: 400 },
    );
  }

  const messages = validatedMessagesResult.data;

  let chat = await getChatById(chatId);
  const mostRecentMessage = messages[messages.length - 1];

  if (!mostRecentMessage) {
    return new Response("No messages to process", { status: 400 });
  }

  if (mostRecentMessage.role !== "user") {
    return new Response("The most recent message must be from the user", {
      status: 400,
    });
  }

  const stream = createUIMessageStream<MyMessage>({
    execute: async ({ writer }) => {
      let generateTitlePromise: Promise<void> | undefined;

      if (!chat) {
        const newChat = await createChat({
          id: chatId,
          userId,
          title: "Generating title...",
          initialMessage: messages,
        });
        chat = newChat;
        writer.write({
          type: "data-frontend-action",
          data: "refresh-sidebar",
          transient: true,
        });

        generateTitlePromise = generateTitle(messages).then(async (title) => {
          const updated = await updateChat(chatId, { title });
          if (updated) chat = updated;
          writer.write({
            type: "data-frontend-action",
            data: "refresh-sidebar",
          });
        });
      } else {
        await appendToChatMessages(chatId, [mostRecentMessage]);
      }

      const result = streamText({
        model: primaryProvider,
        system: `
<task-context>
You are an email assistant that helps users find and understand information from their emails.
</task-context>

<rules>
- You MUST use the search tool for ANY question about emails, people, amounts, dates, or specific information
- NEVER answer from your training data — always search the actual emails first
- If the first search doesn't find enough information, try different keywords or search queries
- Use both semantic (searchQuery) and keyword (keywords) search parameters together for best results
- Only after searching should you formulate your answer based on the search results
- If search returns nothing relevant, say so clearly instead of inventing details
</rules>

<the-ask>
Here is the user's question. Search their emails first, then provide your answer based on what you find.
</the-ask>
`,
        messages: await convertToModelMessages(messages),
        tools: {
          search: createSearchTool(userId),
        },
        stopWhen: [stepCountIs(10)],
      });

      writer.merge(
        result.toUIMessageStream({
          sendSources: true,
          sendReasoning: true,
        }),
      );
      await generateTitlePromise;
    },
    generateId: () => crypto.randomUUID(),
    onFinish: async ({ responseMessage }) => {
      await appendToChatMessages(chatId, [responseMessage]);
    },
  });

  return createUIMessageStreamResponse({ stream });
}
