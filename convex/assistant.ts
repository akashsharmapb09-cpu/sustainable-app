"use node";

import { ConvexError, v } from "convex/values";
import { action } from "./_generated/server";

const chatMessage = v.object({
  role: v.union(v.literal("user"), v.literal("assistant")),
  content: v.string(),
});

export const chat = action({
  args: {
    messages: v.array(chatMessage),
  },
  handler: async (_ctx, { messages }) => {
    if (messages.length === 0 || messages.length > 12) {
      throw new ConvexError("Please start a new conversation and try again.");
    }

    const totalCharacters = messages.reduce((total, message) => {
      if (!message.content.trim() || message.content.length > 2_000) {
        throw new ConvexError("Each message must be between 1 and 2,000 characters.");
      }
      return total + message.content.length;
    }, 0);

    if (totalCharacters > 10_000 || messages[messages.length - 1]?.role !== "user") {
      throw new ConvexError("The conversation is too long. Start a new one and try again.");
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new ConvexError("The AI assistant is not configured yet. Add OPENAI_API_KEY to the Convex deployment environment.");
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
        instructions: [
          "You are GreenSwap's practical sustainability assistant.",
          "Give concise, actionable advice tailored to everyday life in India when relevant.",
          "Explain uncertainty honestly and never invent precise carbon savings or citations.",
          "Do not shame people. Prefer accessible, budget-aware suggestions.",
        ].join(" "),
        input: messages.map(({ role, content }) => ({ role, content })),
        max_output_tokens: 500,
        store: false,
      }),
    });

    if (!response.ok) {
      throw new ConvexError(`The AI service could not respond (${response.status}). Please try again shortly.`);
    }

    const result: unknown = await response.json();
    if (
      !result
      || typeof result !== "object"
      || !("output_text" in result)
      || typeof result.output_text !== "string"
      || !result.output_text.trim()
    ) {
      throw new ConvexError("The AI service returned an empty response. Please try again.");
    }

    return result.output_text.trim();
  },
});
