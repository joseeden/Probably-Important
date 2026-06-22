'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateNote } from '@/app/(app)/notes/[id]/actions';
import RichTextEditor from '@/components/RichTextEditor';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type='submit'
      disabled={pending}
      className='rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50'
    >
      {pending ? 'Saving…' : 'Save changes'}
    </button>
  );
}

interface Props {
  id: string;
  initialTitle: string;
  initialContent: string;
}

export default function EditNoteForm({ id, initialTitle, initialContent }: Props) {
  const boundAction = updateNote.bind(null, id);
  const [state, action] = useActionState(boundAction, null);

  return (
    <form action={action} className='mt-6 flex flex-col gap-4'>
      {state?.error && <p className='text-sm text-red-500'>{state.error}</p>}
      <input
        name='title'
        required
        defaultValue={initialTitle}
        placeholder='Title'
        className='rounded-lg border border-black/10 px-4 py-2 text-base outline-none focus:ring-2 focus:ring-foreground/20 dark:border-white/10 dark:bg-transparent'
      />
      <RichTextEditor name='content' defaultValue={initialContent} />
      <div className='flex items-center gap-4'>
        <SubmitButton />
        <Link
          href={`/notes/${id}`}
          className='text-sm font-medium text-zinc-500 underline underline-offset-4'
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
