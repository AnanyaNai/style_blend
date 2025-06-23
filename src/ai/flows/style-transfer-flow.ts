'use server';

/**
 * @fileOverview This file defines a Genkit flow for transferring a style to an image.
 *
 * - styleTransfer - A function that handles the style transfer process.
 * - StyleTransferInput - The input type for the styleTransfer function.
 * - StyleTransferOutput - The return type for the styleTransfer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StyleTransferInputSchema = z.object({
  targetImage: z
    .string()
    .describe(
      "The target image to apply the style to, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  style: z.string().describe('The style to apply to the image (e.g., "Van Gogh", "Cyberpunk").'),
});
export type StyleTransferInput = z.infer<typeof StyleTransferInputSchema>;

const StyleTransferOutputSchema = z.object({
  generatedImage: z
    .string()
    .describe(
      "The generated image with the style applied, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type StyleTransferOutput = z.infer<typeof StyleTransferOutputSchema>;

export async function styleTransfer(input: StyleTransferInput): Promise<StyleTransferOutput> {
  return styleTransferFlow(input);
}

const styleTransferFlow = ai.defineFlow(
  {
    name: 'styleTransferFlow',
    inputSchema: StyleTransferInputSchema,
    outputSchema: StyleTransferOutputSchema,
  },
  async ({ targetImage, style }) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        { media: { url: targetImage } },
        { text: `Apply the artistic style of "${style}" to the provided image. It is critically important to preserve the original subject, their features (especially facial features), and the overall composition. The final image should be clearly recognizable as the same person and scene, just rendered in a new artistic style. Do not change the person's identity or the core objects in the scene.` },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed.');
    }

    return { generatedImage: media.url };
  }
);
