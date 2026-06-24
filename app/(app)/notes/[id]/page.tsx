import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import DeleteNoteButton from '@/components/DeleteNoteButton';
import SharePanel from '@/components/SharePanel';

export default async function NoteViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/auth');

  const note = await db.note.findUnique({ where: { id } });
  if (!note || note.userId !== session.user.id) notFound();

  return (
    <section id='main-content'>
      <h1 className='text-2xl font-semibold tracking-tight'>{note.title}</h1>
      <p className='mt-1 text-sm text-zinc-500'>
        Updated {new Date(note.updatedAt).toLocaleDateString()}
      </p>
      <div
        className='mt-4 text-base leading-relaxed note-content'
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
      <div role='group' aria-label='Note actions' className='mt-6 flex gap-4 text-sm'>
        <Link
          href={`/notes/${id}/edit`}
          className='font-medium text-foreground underline underline-offset-4'
        >
          Edit
        </Link>
        <DeleteNoteButton id={id} />
        <Link href='/dashboard' className='font-medium text-zinc-500 underline underline-offset-4'>
          Back
        </Link>
      </div>
      <SharePanel noteId={id} initialIsPublic={note.isPublic} initialShareToken={note.shareToken} />
    </section>
  );
}
