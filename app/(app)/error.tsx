'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className='flex flex-col items-center justify-center py-24 text-center'>
      <p className='text-sm font-medium text-zinc-500'>Error</p>
      <h1 className='mt-2 text-2xl font-semibold tracking-tight'>Something went wrong</h1>
      <p className='mt-2 text-sm text-zinc-500'>
        An unexpected error occurred. Your notes are safe.
      </p>
      <div className='mt-6 flex flex-wrap justify-center gap-3'>
        <button
          type='button'
          onClick={reset}
          className='rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90'
        >
          Try again
        </button>
        <Link
          href='/dashboard'
          className='rounded-lg border border-black/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5'
        >
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}
