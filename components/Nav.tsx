'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth-client';

export default function Nav() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/auth');
    router.refresh();
  }

  return (
    <header className='border-b border-black/10 dark:border-white/10'>
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background'
      >
        Skip to main content
      </a>
      <nav
        aria-label='Main navigation'
        className='mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4'
      >
        <Link href='/dashboard' className='text-lg font-semibold tracking-tight'>
          Probably Important
        </Link>
        <div className='flex items-center gap-4 text-sm'>
          <button
            type='button'
            onClick={handleSignOut}
            className='font-medium text-zinc-500 hover:text-foreground'
          >
            Sign out
          </button>
        </div>
      </nav>
    </header>
  );
}
