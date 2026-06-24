'use client';

import { useState } from 'react';
import { toggleSharing } from '@/app/(app)/notes/[id]/actions';

interface SharePanelProps {
  noteId: string;
  initialIsPublic: boolean;
  initialShareToken: string | null;
}

export default function SharePanel({
  noteId,
  initialIsPublic,
  initialShareToken,
}: SharePanelProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [shareToken, setShareToken] = useState(initialShareToken);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    setLoading(true);
    setError(null);
    try {
      const result = await toggleSharing(noteId);
      setIsPublic(result.isPublic);
      setShareToken(result.shareToken);
    } catch {
      setError('Failed to update sharing. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!shareToken) return;
    await navigator.clipboard.writeText(`${window.location.origin}/share/${shareToken}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className='mt-6 border-t border-black/10 pt-4 dark:border-white/10'>
      <div className='flex items-center gap-3'>
        <span className='text-sm text-zinc-600 dark:text-zinc-400'>
          Sharing is <span className='font-medium text-foreground'>{isPublic ? 'on' : 'off'}</span>
        </span>
        <button
          type='button'
          onClick={handleToggle}
          disabled={loading}
          aria-label={isPublic ? 'Disable sharing' : 'Enable sharing'}
          className='text-sm font-medium underline underline-offset-4 disabled:opacity-40'
        >
          {loading ? 'Saving…' : isPublic ? 'Turn off' : 'Turn on'}
        </button>
      </div>
      {error && (
        <p role='alert' className='mt-2 text-sm text-red-500'>
          {error}
        </p>
      )}
      <div aria-live='polite' aria-atomic='true'>
        {isPublic && shareToken && (
          <div className='mt-3 flex items-center gap-2'>
            <input
              readOnly
              suppressHydrationWarning
              value={
                typeof window !== 'undefined'
                  ? `${window.location.origin}/share/${shareToken}`
                  : `/share/${shareToken}`
              }
              aria-label='Share link'
              className='min-w-0 flex-1 rounded border border-black/10 bg-black/[.03] px-2 py-1 font-mono text-xs text-foreground dark:border-white/10 dark:bg-white/[.03]'
            />
            <button
              type='button'
              onClick={handleCopy}
              aria-label='Copy share link'
              className='shrink-0 text-sm font-medium underline underline-offset-4'
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
