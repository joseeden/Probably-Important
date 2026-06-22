'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const updateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string(),
});

export async function updateNote(
  id: string,
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/auth');

  const note = await db.note.findUnique({ where: { id } });
  if (!note || note.userId !== session.user.id) {
    return { error: 'Note not found' };
  }

  const result = updateSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content') ?? '',
  });

  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? 'Invalid input' };
  }

  await db.note.update({
    where: { id },
    data: {
      title: result.data.title,
      content: result.data.content,
    },
  });

  redirect(`/notes/${id}`);
}

export async function toggleSharing(
  id: string,
): Promise<{ isPublic: boolean; shareToken: string | null }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/auth');

  const note = await db.note.findUnique({ where: { id } });
  if (!note || note.userId !== session.user.id) {
    throw new Error('Note not found');
  }

  const nowPublic = !note.isPublic;
  const updated = await db.note.update({
    where: { id },
    data: {
      isPublic: nowPublic,
      shareToken: nowPublic ? (note.shareToken ?? crypto.randomUUID()) : note.shareToken,
    },
    select: { isPublic: true, shareToken: true },
  });

  return updated;
}

export async function deleteNote(id: string): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/auth');

  const note = await db.note.findUnique({ where: { id } });
  if (!note || note.userId !== session.user.id) redirect('/dashboard');

  await db.note.delete({ where: { id } });
  redirect('/dashboard');
}
