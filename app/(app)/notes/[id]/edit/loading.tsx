export default function EditNoteLoading() {
  return (
    <section aria-label='Loading editor' aria-busy='true'>
      <div className='h-8 w-28 animate-pulse rounded bg-black/[.06] dark:bg-white/[.06]' />
      <div className='mt-6 flex flex-col gap-4'>
        <div className='h-10 w-full animate-pulse rounded-lg border border-black/[.06] bg-black/[.02] dark:border-white/[.06] dark:bg-white/[.02]' />
        <div className='h-64 w-full animate-pulse rounded-lg border border-black/[.06] bg-black/[.02] dark:border-white/[.06] dark:bg-white/[.02]' />
      </div>
    </section>
  );
}
