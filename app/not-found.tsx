import Link from 'next/link';

export default function NotFound() {
  return (
    <main className='flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black'>
      <div className='text-center'>
        <p className='text-sm font-medium text-zinc-500'>404</p>
        <h1 className='mt-2 text-2xl font-semibold tracking-tight'>Page not found</h1>
        <p className='mt-2 text-sm text-zinc-500'>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className='mt-6 flex justify-center gap-3'>
          <Link
            href='/dashboard'
            className='rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90'
          >
            Go to dashboard
          </Link>
          <Link
            href='/auth'
            className='rounded-lg border border-black/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5'
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
