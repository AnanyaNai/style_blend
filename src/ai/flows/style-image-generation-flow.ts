'use server';

/**
 * @fileOverview A Genkit flow for generating an image based on a style prompt.
 * - generateStyleImage - Generates an image for a given style.
 * - GenerateStyleImageInput - Input for the flow.
 * - GenerateStyleImageOutput - Output for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStyleImageInputSchema = z.object({
  style: z.string().describe('The style to generate an image for (e.g., "Van Gogh", "Cyberpunk").'),
});
export type GenerateStyleImageInput = z.infer<typeof GenerateStyleImageInputSchema>;

const GenerateStyleImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "The generated image for the style, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateStyleImageOutput = z.infer<typeof GenerateStyleImageOutputSchema>;

export async function generateStyleImage(input: GenerateStyleImageInput): Promise<GenerateStyleImageOutput> {
  return generateStyleImageFlow(input);
}

const generateStyleImageFlow = ai.defineFlow(
  {
    name: 'generateStyleImageFlow',
    inputSchema: GenerateStyleImageInputSchema,
    outputSchema: GenerateStyleImageOutputSchema,
  },
  async ({ style }) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A high quality, vibrant, and clear reference image that visually represents the artistic style of: "${style}". The image should be an exemplar of this style.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed for style.');
    }

    return { imageUrl: media.url };
  }
);
