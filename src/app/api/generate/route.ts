import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamObject } from "ai";
import z from "zod";
import { env } from "~/env";
import { getNotesMeta } from "~/lib/notes-data";

type Note = {
  name: string;
};

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const requestSchema = z.object({
  prompt: z.string().optional(),
  image: z
    .string()
    .refine((value) => {
      try {
        new URL(value);
        return true;
      } catch (_error) {
        return false;
      }
    }, "Invalid image URL provided.")
    .optional(),
});

export async function POST(req: Request) {
  const payload = await req.json();
  const { prompt, image } = requestSchema.parse(payload);

  if (!(prompt || image)) {
    return new Response("Provide a prompt or image before submitting.", {
      status: 400,
    });
  }

  const notes = (await getNotesMeta()) as Note[];
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
        content: `You are a helpful assistant that gives scent notes based on the user's description. The user will provide a description of the scent and maybe an image, and you will generate a list of notes that describe the scents vibe. Try to be creative with it. Here are the notes you can use: ${notesList}.\nYou MUST only use notes from the list. You MUST provide maximum of 7 scents.`,
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
    ],
  });
  return result.toTextStreamResponse();
}
