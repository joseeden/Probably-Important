import Link from 'next/link';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

const features = [
  {
    title: 'Rich text editing',
    description: 'Format with headings, bold, lists, links, and blockquotes using a clean toolbar.',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
      >
        <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
        <path d='M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z' />
      </svg>
    ),
  },
  {
    title: 'Private by default',
    description: "Your notes are visible only to you. Share specific ones when you're ready.",
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
      >
        <rect width='18' height='11' x='3' y='11' rx='2' ry='2' />
        <path d='M7 11V7a5 5 0 0 1 10 0v4' />
      </svg>
    ),
  },
  {
    title: 'Share via link',
    description: 'Generate a public link for any note. Turn sharing on or off any time.',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
      >
        <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
        <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
      </svg>
    ),
  },
];

export default async function LandingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect('/dashboard');

  return (
    <main id='main-content' className='flex flex-1 flex-col items-center bg-zinc-50 dark:bg-black'>
      <section className='flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 pb-16 pt-24 text-center'>
        <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>Probably Important</h1>
        <p className='mt-4 max-w-md text-lg text-zinc-500 dark:text-zinc-400'>
          Write, organise, and share richly formatted notes.
          <br className='hidden sm:block' />
          Private by default. Shareable when you&apos;re ready.
        </p>
        <div className='mt-8 flex flex-wrap justify-center gap-3'>
          <Link
            href='/auth'
            className='rounded-lg bg-foreground px-5 py-2.5 font-medium text-background transition-opacity hover:opacity-90'
          >
            Get started
          </Link>
          <Link
            href='/auth'
            className='rounded-lg border border-black/15 px-5 py-2.5 font-medium transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/5'
          >
            Sign in
          </Link>
        </div>
      </section>

      <section aria-label='Features' className='w-full max-w-4xl px-6 pb-24'>
        <div className='grid gap-4 sm:grid-cols-3'>
          {features.map((feature) => (
            <div
              key={feature.title}
              className='rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-950'
            >
              <div className='mb-3 text-foreground'>{feature.icon}</div>
              <h2 className='font-semibold'>{feature.title}</h2>
              <p className='mt-1.5 text-sm text-zinc-500 dark:text-zinc-400'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
