"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";

export const generateScentNotes = action({
  args: {
    prompt: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { prompt, storageId } = args;
    const image = storageId && (await ctx.storage.getUrl(storageId));
    const generateText = (await import("ai")).generateText;
    const openrouter = (await import("@openrouter/ai-sdk-provider")).openrouter;
    const result = await generateText({
      model: openrouter("openai/gpt-4.1"),
      system:
        "You are a helpful assistant that provides fragrantica notes based on the user's description. User will provider either a description of the scent or a reference image. You will generate a list of notes that describe the scent. The notes should be in the form of bullet points, and should be written in a conversational tone. You should also include any relevant information about the scent, such as its name, ingredients, or any other relevant details. Finally, you should provide a conclusion that summarizes the notes and provides any additional information that may be relevant to the scent.",
      messages: [
        {
          role: "user",
          content: [
            ...(image
              ? ([
                  {
                    type: "image",
                    image: new URL(image),
                  },
                ] as const)
              : []),
            ...(prompt
              ? ([
                  {
                    type: "text",
                    text: prompt,
                  },
                ] as const)
              : []),
          ],
        },
      ],
    });
    return result.text;
  },
});
