'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth-client';

type Mode = 'signin' | 'signup';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isSignup = mode === 'signup';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const { error } = isSignup
      ? await signUp.email({ name, email, password })
      : await signIn.email({ email, password });

    setPending(false);

    if (error) {
      setError(error.message ?? 'Something went wrong. Please try again.');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main
      id='main-content'
      className='flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950'
    >
      <div className='w-full max-w-sm rounded-2xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-950'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          {isSignup ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className='mt-1 text-sm text-zinc-500'>
          {isSignup ? 'Sign up to start writing notes.' : 'Sign in to your notes.'}
        </p>

        <form onSubmit={handleSubmit} className='mt-6 flex flex-col gap-4'>
          {isSignup && (
            <label className='flex flex-col gap-1 text-sm font-medium'>
              Name
              <input
                type='text'
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete='name'
                className='rounded-lg border border-black/15 bg-transparent px-3 py-2 text-base font-normal outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50'
              />
            </label>
          )}

          <label className='flex flex-col gap-1 text-sm font-medium'>
            Email
            <input
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete='email'
              className='rounded-lg border border-black/15 bg-transparent px-3 py-2 text-base font-normal outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50'
            />
          </label>

          <label className='flex flex-col gap-1 text-sm font-medium'>
            Password
            <input
              type='password'
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              aria-describedby={isSignup ? 'password-hint' : undefined}
              className='rounded-lg border border-black/15 bg-transparent px-3 py-2 text-base font-normal outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50'
            />
            {isSignup && (
              <span id='password-hint' className='text-xs font-normal text-zinc-400'>
                Minimum 8 characters
              </span>
            )}
          </label>

          <div aria-live='polite' aria-atomic='true'>
            {error && <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>}
          </div>

          <button
            type='submit'
            disabled={pending}
            className='mt-2 rounded-lg bg-foreground px-4 py-2 font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50'
          >
            {pending ? 'Please wait…' : isSignup ? 'Sign up' : 'Sign in'}
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-zinc-500'>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type='button'
            onClick={() => {
              setMode(isSignup ? 'signin' : 'signup');
              setError(null);
            }}
            className='font-medium text-foreground underline underline-offset-4'
          >
            {isSignup ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </main>
  );
}
