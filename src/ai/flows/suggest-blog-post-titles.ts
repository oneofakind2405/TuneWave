'use server';

/**
 * @fileOverview AI-powered blog post title generator for upcoming artists.
 *
 * - suggestBlogPostTitles - A function that generates blog post titles.
 * - SuggestBlogPostTitlesInput - The input type for the suggestBlogPostTitles function.
 * - SuggestBlogPostTitlesOutput - The return type for the suggestBlogPostTitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBlogPostTitlesInputSchema = z.object({
  artistName: z.string().describe('The name of the upcoming artist.'),
  artistGenre: z.string().describe('The genre of music the artist plays.'),
  keywords: z.string().describe('Relevant keywords to the artist or their music.'),
});
export type SuggestBlogPostTitlesInput = z.infer<typeof SuggestBlogPostTitlesInputSchema>;

const SuggestBlogPostTitlesOutputSchema = z.object({
  titles: z.array(z.string()).describe('An array of suggested blog post titles.'),
});
export type SuggestBlogPostTitlesOutput = z.infer<typeof SuggestBlogPostTitlesOutputSchema>;

export async function suggestBlogPostTitles(input: SuggestBlogPostTitlesInput): Promise<SuggestBlogPostTitlesOutput> {
  return suggestBlogPostTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBlogPostTitlesPrompt',
  input: {schema: SuggestBlogPostTitlesInputSchema},
  output: {schema: SuggestBlogPostTitlesOutputSchema},
  prompt: `You are a creative blog post title generator for a music blog.

  Generate 5 blog post titles for an upcoming artist.

  Artist Name: {{{artistName}}}
  Artist Genre: {{{artistGenre}}}
  Keywords: {{{keywords}}}

  Titles:`, 
});

const suggestBlogPostTitlesFlow = ai.defineFlow(
  {
    name: 'suggestBlogPostTitlesFlow',
    inputSchema: SuggestBlogPostTitlesInputSchema,
    outputSchema: SuggestBlogPostTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
