import Link from 'next/link';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import SearchBar from '@/components/SearchBar';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/auth');

  const query = q?.trim() ?? '';

  const notes = await db.note.findMany({
    where: {
      userId: session.user.id,
      ...(query && {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, updatedAt: true },
  });

  return (
    <section id='main-content'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold tracking-tight'>Your notes</h1>
        <Link
          href='/notes/new'
          className='rounded-lg bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90'
        >
          New note
        </Link>
      </div>

      <div className='mt-4'>
        <SearchBar defaultValue={query} />
      </div>

      {notes.length === 0 && !query ? (
        <div className='mt-12 flex flex-col items-center gap-4 text-center'>
          <div className='rounded-full border border-black/10 p-4 dark:border-white/10'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden='true'
            >
              <path d='M12 20h9' />
              <path d='M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z' />
            </svg>
          </div>
          <div>
            <p className='font-medium'>No notes yet</p>
            <p className='mt-1 text-sm text-zinc-500'>Create your first note to get started.</p>
          </div>
          <Link
            href='/notes/new'
            className='rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90'
          >
            Create your first note
          </Link>
        </div>
      ) : notes.length === 0 && query ? (
        <div className='mt-12 flex flex-col items-center gap-3 text-center'>
          <p className='font-medium'>No notes match &ldquo;{query}&rdquo;</p>
          <Link
            href='/dashboard'
            className='text-sm font-medium text-zinc-500 underline underline-offset-4'
          >
            Clear search
          </Link>
        </div>
      ) : (
        <ul className='mt-4 flex flex-col gap-2'>
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
