import { z } from 'zod';

export const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string(),
});

export type NoteInput = z.infer<typeof noteSchema>;
