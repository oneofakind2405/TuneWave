'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateTitlesAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  artistName: z.string().min(2, {
    message: 'Artist name must be at least 2 characters.',
  }),
  artistGenre: z.string().min(2, {
    message: 'Genre must be at least 2 characters.',
  }),
  keywords: z.string().min(3, {
    message: 'Keywords must be at least 3 characters.',
  }),
});

export function BlogPostGenerator() {
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      artistName: '',
      artistGenre: '',
      keywords: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setGeneratedTitles([]);
    try {
      const result = await generateTitlesAction(data);
      setGeneratedTitles(result.titles);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="bg-muted/50 py-12 sm:py-16 lg:py-20">
      <div className="container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <Wand2 className="h-12 w-12 text-primary" />
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl font-headline">AI-Powered Content Ideas</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stuck on what to write? Generate creative blog post titles for upcoming artists and kickstart your next article.
            </p>
          </div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Generate Blog Post Titles</CardTitle>
              <CardDescription>Enter details about an artist to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="artistName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Artist Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., The Lumineers" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="artistGenre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Artist Genre</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Indie Folk" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keywords</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., acoustic, heartfelt, new album" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Titles
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              {generatedTitles.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold">Suggested Titles:</h3>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                    {generatedTitles.map((title, index) => (
                      <li key={index} className="animate-in fade-in-0 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                        {title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
