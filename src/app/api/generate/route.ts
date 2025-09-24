import { readFileSync } from "node:fs";
import path from "node:path";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamObject } from "ai";
import z from "zod";
import { env } from "~/env";

type Note = {
  name: string;
  link: string;
  image_url: string;
};

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt, image } = (await req.json()) as {
    prompt: string;
    image?: string;
  };

  const filePath = path.join(process.cwd(), "fragrantica_notes.json");
  const fileContents = readFileSync(filePath, "utf-8");
  const notes = JSON.parse(fileContents) as Note[];
  const notesList = notes.map((note) => note.name);

  const openrouter = createOpenRouter({
    apiKey: env.OPENROUTER_API_KEY,
  });

  const result = streamObject({
    schema: z.object({
      notes: z.array(z.string()),
    }),
    model: openrouter("openai/gpt-4.1"),
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that gives scent notes based on the user's description. The user will provide a description of the scent and maybe an image, and you will generate a list of notes that describe the scents vibe. Try to be creative with it. Here are the notes you can use: ${notesList}.\nYou MUST only use notes from the list. You MUST provide maximum of 5 scents.`,
      },
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
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  return result.toTextStreamResponse();
}
