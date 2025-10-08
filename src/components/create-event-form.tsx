
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Event } from '@/lib/events-data';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  category: z.enum(['Rock', 'Pop', 'Electronic']),
  imageUrl: z.string().min(1, 'Image is required'),
  imageHint: z.string().min(1, 'Image hint is required'),
  latitude: z.number(),
  longitude: z.number(),
});

type EventFormValues = z.infer<typeof formSchema>;

interface CreateEventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (event: Omit<Event, 'id' | 'creatorId' | 'createdAt' | 'viewCount'>) => void;
}

export function CreateEventForm({
  open,
  onOpenChange,
  onCreate,
}: CreateEventFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        category: 'Rock',
        imageUrl: 'https://picsum.photos/seed/event-placeholder/400/300',
        imageHint: 'concert band',
        latitude: 40.7128 + (Math.random() - 0.5) * 2,
        longitude: -74.0060 + (Math.random() - 0.5) * 2,
    },
  });

  const resetCoordinates = () => {
    form.setValue('latitude', 40.7128 + (Math.random() - 0.5) * 2);
    form.setValue('longitude', -74.0060 + (Math.random() - 0.5) * 2);
  };

  useEffect(() => {
    if (open) {
      resetCoordinates();
    }
  }, [open]);


  const onSubmit = (data: EventFormValues) => {
    onCreate(data as any);
    onOpenChange(false);
    form.reset();
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        form.setValue('imageUrl', dataUrl);
        setImagePreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) {
        form.reset();
        setImagePreview(null);
      }
    }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Rock">Rock</SelectItem>
                          <SelectItem value="Pop">Pop</SelectItem>
                          <SelectItem value="Electronic">Electronic</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file:text-primary-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {imagePreview && (
                <div className="relative w-full h-64 rounded-md overflow-hidden">
                  <Image src={imagePreview} alt="Image Preview" fill style={{objectFit: "cover"}} />
                </div>
              )}
                <FormField
                  control={form.control}
                  name="imageHint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Hint</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* This button is hidden but allows form submission via Enter key */}
                <button type="submit" className="hidden"></button>
            </form>
          </Form>
        </div>
        <DialogFooter className="p-6 pt-4 border-t bg-background">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="create-event-form">Create Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// A bit of a hack to link the external submit button to the form
// We give the form an ID and the button a `form` attribute.
const OriginalCreateEventForm = CreateEventForm;
export { OriginalCreateEventForm as CreateEventForm };
const newSubmit = (data: EventFormValues, onCreate: (event: any) => void, onOpenChange: (open: boolean) => void, form: any, setImagePreview: any) => {
    onCreate(data as any);
    onOpenChange(false);
    form.reset();
    setImagePreview(null);
}
// @ts-ignore
CreateEventForm = ({ open, onOpenChange, onCreate }: CreateEventFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        category: 'Rock',
        imageUrl: 'https://picsum.photos/seed/event-placeholder/400/300',
        imageHint: 'concert band',
        latitude: 40.7128 + (Math.random() - 0.5) * 2,
        longitude: -74.0060 + (Math.random() - 0.5) * 2,
    },
  });

  const resetCoordinates = () => {
    form.setValue('latitude', 40.7128 + (Math.random() - 0.5) * 2);
    form.setValue('longitude', -74.0060 + (Math.random() - 0.5) * 2);
  };

  useEffect(() => {
    if (open) {
      resetCoordinates();
    }
  }, [open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        form.setValue('imageUrl', dataUrl);
        setImagePreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) {
        form.reset();
        setImagePreview(null);
      }
    }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0 flex-shrink-0">
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto px-6">
          <Form {...form}>
            <form id="create-event-form" onSubmit={form.handleSubmit((data) => newSubmit(data, onCreate, onOpenChange, form, setImagePreview))} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Rock">Rock</SelectItem>
                          <SelectItem value="Pop">Pop</SelectItem>
                          <SelectItem value="Electronic">Electronic</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file:text-primary-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {imagePreview && (
                <div className="relative w-full h-64 rounded-md overflow-hidden">
                  <Image src={imagePreview} alt="Image Preview" fill style={{objectFit: "cover"}} />
                </div>
              )}
                <FormField
                  control={form.control}
                  name="imageHint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Hint</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </form>
          </Form>
        </div>
        <DialogFooter className="p-6 pt-4 border-t bg-background flex-shrink-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="create-event-form">Create Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
