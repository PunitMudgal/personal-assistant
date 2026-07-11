import { convertToModelMessages, generateText, UIMessage } from "ai";
import { tertiaryProvider } from "../../../../models";

export async function generateTitle(messages: UIMessage[]): Promise<string>{
    const result = await generateText({
        model: tertiaryProvider,
        messages: await convertToModelMessages(messages),
        system: "You are a helpful assistant that can generate titles for conversations. The title will be used for organizing conversations in a chat application. Generate a short chat title (max 6 words). Return only the title, no quotes, no explanation, no emojies.",
        
    })
    return result.text;
}