export default function NoteViewLoading() {
  return (
    <section aria-label='Loading note' aria-busy='true'>
      <div className='h-8 w-3/4 animate-pulse rounded bg-black/[.06] dark:bg-white/[.06]' />
      <div className='mt-1.5 h-4 w-36 animate-pulse rounded bg-black/[.04] dark:bg-white/[.04]' />
      <div className='mt-6 space-y-2.5'>
        <div className='h-4 w-full animate-pulse rounded bg-black/[.04] dark:bg-white/[.04]' />
        <div className='h-4 w-[92%] animate-pulse rounded bg-black/[.04] dark:bg-white/[.04]' />
        <div className='h-4 w-4/5 animate-pulse rounded bg-black/[.04] dark:bg-white/[.04]' />
        <div className='h-4 w-[85%] animate-pulse rounded bg-black/[.04] dark:bg-white/[.04]' />
        <div className='h-4 w-3/5 animate-pulse rounded bg-black/[.04] dark:bg-white/[.04]' />
      </div>
    </section>
  );
}
