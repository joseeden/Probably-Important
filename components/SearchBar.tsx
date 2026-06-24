'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function SearchBar({ defaultValue = '' }: { defaultValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value) {
        router.replace(`${pathname}?q=${encodeURIComponent(value)}`);
      } else {
        router.replace(pathname);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [value, router, pathname]);

  return (
    <div className='relative'>
      <input
        type='search'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Search notes…'
        aria-label='Search notes'
        className='w-full rounded-lg border border-black/10 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20 dark:border-white/10 dark:bg-transparent'
      />
      {value && (
        <button
          type='button'
          onClick={() => setValue('')}
          aria-label='Clear search'
          className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground'
        >
          ✕
        </button>
      )}
    </div>
  );
}
