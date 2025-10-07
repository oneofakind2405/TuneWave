'use server';

import { suggestBlogPostTitles, type SuggestBlogPostTitlesInput, type SuggestBlogPostTitlesOutput } from '@/ai/flows/suggest-blog-post-titles';
import { z } from 'zod';

const SuggestBlogPostTitlesInputSchema = z.object({
  artistName: z.string(),
  artistGenre: z.string(),
  keywords: z.string(),
});

export async function generateTitlesAction(input: SuggestBlogPostTitlesInput): Promise<SuggestBlogPostTitlesOutput> {
  const parsedInput = SuggestBlogPostTitlesInputSchema.safeParse(input);

  if (!parsedInput.success) {
    throw new Error('Invalid input');
  }

  try {
    const result = await suggestBlogPostTitles(parsedInput.data);
    return result;
  } catch (error) {
    console.error("Error generating blog post titles:", error);
    // In a real app, you'd want more robust error handling and logging
    throw new Error("Failed to generate titles. Please try again later.");
  }
}
