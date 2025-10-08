import { v } from "convex/values";
import { action, mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => await ctx.storage.generateUploadUrl(),
});

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const PNG_SIGNATURE = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
const JPEG_START = new Uint8Array([255, 216, 255]);
const WEBP_HEADER = new Uint8Array([82, 73, 70, 70]);

const startsWith = (bytes: Uint8Array, signature: Uint8Array) => {
  if (bytes.length < signature.length) {
    return false;
  }

  for (let index = 0; index < signature.length; index++) {
    if (bytes[index] !== signature[index]) {
      return false;
    }
  }

  return true;
};

const detectMimeType = (bytes: Uint8Array): string | null => {
  if (startsWith(bytes, PNG_SIGNATURE)) {
    return "image/png";
  }

  const isJpeg =
    startsWith(bytes, JPEG_START) &&
    bytes.at(-2) === 255 &&
    bytes.at(-1) === 217;
  if (isJpeg) {
    return "image/jpeg";
  }

  const isWebp =
    startsWith(bytes, WEBP_HEADER) &&
    bytes.length > 12 &&
    bytes[8] === 87 &&
    bytes[9] === 69 &&
    bytes[10] === 66 &&
    bytes[11] === 80;
  if (isWebp) {
    return "image/webp";
  }

  return null;
};

export const saveImage = action({
  args: { image: v.bytes() },
  handler: async (ctx, args) => {
    const size = args.image.byteLength;

    if (size === 0) {
      throw new Error("Uploaded file is empty.");
    }

    if (size > MAX_IMAGE_BYTES) {
      throw new Error("Image exceeds the 5MB size limit.");
    }

    const bytes = new Uint8Array(args.image);
    const mimeType = detectMimeType(bytes);

    if (!mimeType) {
      throw new Error("Unsupported image format. Use PNG, JPEG, or WebP.");
    }

    const blob = new Blob([bytes], { type: mimeType });
    const storageId = await ctx.storage.store(blob);
    const storageUrl = await ctx.storage.getUrl(storageId);

    if (!storageUrl) {
      throw new Error("Failed to create a public image URL.");
    }

    return storageUrl;
  },
});
