import { primaryProvider } from "../../../../models";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  safeValidateUIMessages,
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

export const maxDuration = 30;

export type MyMessage = UIMessage<
  never,
  {
    "frontend-action": "refresh-sidebar";
  }
>;

// async function generateTitle(messages: UIMessage[]): Promise<string> {
//   const firstUserText = messages
//     .find((m) => m.role === "user")
//     ?.parts.filter((p) => p.type === "text")
//     .map((p) => (p.type === "text" ? p.text : ""))
//     .join(" ")
//     .trim();

//   if (!firstUserText) return "New conversation";

//   const { text } = await generateText({
//     model: primaryProvider,
//     system:
//       "Generate a short chat title (max 6 words). Return only the title, no quotes.",
//     prompt: firstUserText.slice(0, 500),
//   });

//   return text.trim() || "New conversation";
// }

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
        messages: await convertToModelMessages(messages),
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
