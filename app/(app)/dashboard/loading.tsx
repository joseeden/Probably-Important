export default function DashboardLoading() {
  return (
    <section aria-label='Loading notes' aria-busy='true'>
      <div className='flex items-center justify-between'>
        <div className='h-8 w-32 animate-pulse rounded bg-black/[.06] dark:bg-white/[.06]' />
        <div className='h-8 w-24 animate-pulse rounded-lg bg-black/[.06] dark:bg-white/[.06]' />
      </div>
      <div className='mt-4 h-9 w-full animate-pulse rounded-lg border border-black/[.06] bg-black/[.02] dark:border-white/[.06] dark:bg-white/[.02]' />
      <ul className='mt-4 flex flex-col gap-2'>
        {[1, 2, 3, 4].map((i) => (
          <li
            key={i}
            className='h-[52px] animate-pulse rounded-lg border border-black/[.04] bg-black/[.02] dark:border-white/[.04] dark:bg-white/[.02]'
          />
        ))}
      </ul>
    </section>
  );
}
