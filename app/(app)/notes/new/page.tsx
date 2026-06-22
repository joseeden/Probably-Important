'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createNote } from './actions';
import RichTextEditor from '@/components/RichTextEditor';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type='submit'
      disabled={pending}
      className='rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50'
    >
      {pending ? 'Saving…' : 'Create note'}
    </button>
  );
}

export default function NewNotePage() {
  const [state, action] = useActionState(createNote, null);

  return (
    <section>
      <h1 className='text-2xl font-semibold tracking-tight'>New note</h1>
      <form action={action} className='mt-6 flex flex-col gap-4'>
        {state?.error && <p className='text-sm text-red-500'>{state.error}</p>}
        <input
          name='title'
          required
          placeholder='Title'
          className='rounded-lg border border-black/10 px-4 py-2 text-base outline-none focus:ring-2 focus:ring-foreground/20 dark:border-white/10 dark:bg-transparent'
        />
        <RichTextEditor name='content' />
        <div>
          <SubmitButton />
        </div>
      </form>
    </section>
  );
}
