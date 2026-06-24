'use client';

import { useRef, useState, useTransition } from 'react';
import { deleteNote } from '@/app/(app)/notes/[id]/actions';

export default function DeleteNoteButton({ id }: { id: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function openDialog() {
    setError(null);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    setError(null);
    dialogRef.current?.close();
  }

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteNote(id);
      } catch {
        setError('Failed to delete note. Please try again.');
      }
    });
  }

  return (
    <>
      <button
        type='button'
        onClick={openDialog}
        className='font-medium text-red-500 underline underline-offset-4'
      >
        Delete
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby='delete-dialog-title'
        aria-modal='true'
        className='m-auto rounded-xl border border-black/10 bg-white p-6 shadow-lg backdrop:bg-black/40 dark:border-white/10 dark:bg-zinc-950'
      >
        <h2 id='delete-dialog-title' className='text-base font-semibold'>
          Delete note?
        </h2>
        <p className='mt-1 text-sm text-zinc-500'>This cannot be undone.</p>
        {error && (
          <p role='alert' className='mt-3 text-sm text-red-500'>
            {error}
          </p>
        )}
        <div className='mt-5 flex justify-end gap-3'>
          <button
            type='button'
            autoFocus
            onClick={closeDialog}
            className='rounded-lg border border-black/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleDelete}
            disabled={pending}
            className='rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50'
          >
            {pending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </dialog>
    </>
  );
}
