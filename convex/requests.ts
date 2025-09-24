import { v } from "convex/values";
import { action, mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => await ctx.storage.generateUploadUrl(),
});

export const saveImage = action({
  args: { image: v.bytes() },
  handler: async (ctx, args) => {
    const blob = new Blob([args.image], { type: "image/png" });

    const storageId = await ctx.storage.store(blob);

    return await ctx.storage.getUrl(storageId);
  },
});
