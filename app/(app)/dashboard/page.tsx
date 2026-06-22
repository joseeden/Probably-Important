import Link from 'next/link';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/auth');

  const notes = await db.note.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, updatedAt: true },
  });

  return (
    <section>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold tracking-tight'>Your notes</h1>
        <Link
          href='/notes/new'
          className='rounded-lg bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90'
        >
          New note
        </Link>
      </div>
      {notes.length === 0 ? (
        <p className='mt-6 text-sm text-zinc-500'>No notes yet. Create your first one.</p>
      ) : (
        <ul className='mt-6 flex flex-col gap-2'>
          {notes.map((note) => (
            <li key={note.id}>
              <Link
                href={`/notes/${note.id}`}
                className='flex items-center justify-between rounded-lg border border-black/10 px-4 py-3 transition-colors hover:bg-black/[.03] dark:border-white/10 dark:hover:bg-white/[.05]'
              >
                <span className='font-medium'>{note.title}</span>
                <span className='text-sm text-zinc-500'>
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
