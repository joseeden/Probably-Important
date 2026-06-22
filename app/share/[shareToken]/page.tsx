import { notFound } from 'next/navigation';
import { db } from '@/lib/db';

export default async function SharedNotePage({
  params,
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = await params;

  const note = await db.note.findUnique({ where: { shareToken } });
  if (!note || !note.isPublic) notFound();

  return (
    <main className='mx-auto w-full max-w-3xl flex-1 px-6 py-12'>
      <p className='text-sm text-zinc-500'>Shared note</p>
      <h1 className='mt-2 text-2xl font-semibold tracking-tight'>{note.title}</h1>
      <div
        className='mt-4 text-base leading-relaxed note-content'
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
    </main>
  );
}
