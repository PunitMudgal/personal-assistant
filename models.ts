import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createGroq } from "@ai-sdk/groq";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY
})

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROTUER_API_KEY
})

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY
})

export const primaryProvider = google('gemini-3.5-flash')
export const secondaryProvider = openrouter("google/gemma-4-31b-it:free")
export const tertiaryProvider = groq("llama-3.3-70b-versatile") // generate title 
