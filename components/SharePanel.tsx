'use client';

import { useEffect, useState } from 'react';
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
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function handleToggle() {
    setLoading(true);
    try {
      const result = await toggleSharing(noteId);
      setIsPublic(result.isPublic);
      setShareToken(result.shareToken);
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

  const shareUrl = `${origin}/share/${shareToken}`;

  return (
    <div className='mt-6 border-t border-zinc-200 pt-4'>
      <div className='flex items-center gap-3'>
        <span className='text-sm text-zinc-600'>
          Sharing is <span className='font-medium text-foreground'>{isPublic ? 'on' : 'off'}</span>
        </span>
        <button
          onClick={handleToggle}
          disabled={loading}
          className='text-sm font-medium underline underline-offset-4 disabled:opacity-40'
        >
          {loading ? 'Saving…' : isPublic ? 'Turn off' : 'Turn on'}
        </button>
      </div>
      {isPublic && shareToken && (
        <div className='mt-3 flex items-center gap-2'>
          <input
            readOnly
            value={shareUrl}
            className='min-w-0 flex-1 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 font-mono text-xs text-zinc-700'
          />
          <button
            onClick={handleCopy}
            className='shrink-0 text-sm font-medium underline underline-offset-4'
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
