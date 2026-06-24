'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { useState } from 'react';

interface RichTextEditorProps {
  name: string;
  defaultValue?: string;
}

function Toolbar({ editor }: { editor: Editor }) {
  const btn = (active: boolean) =>
    `rounded px-2 py-1 text-sm font-medium transition-colors ${
      active
        ? 'bg-foreground text-background'
        : 'text-foreground hover:bg-black/5 dark:hover:bg-white/5'
    }`;

  const sep = 'mx-0.5 w-px self-stretch bg-black/10 dark:bg-white/10';

  function handleLink() {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt('Enter URL');
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div
      role='toolbar'
      aria-label='Text formatting'
      className='flex flex-wrap items-center gap-0.5 border-b border-black/10 px-2 py-1.5 dark:border-white/10'
    >
      <button
        type='button'
        aria-label='Bold'
        aria-pressed={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editor.isActive('bold'))}
      >
        <strong>B</strong>
      </button>
      <button
        type='button'
        aria-label='Italic'
        aria-pressed={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editor.isActive('italic'))}
      >
        <em>I</em>
      </button>
      <button
        type='button'
        aria-label='Underline'
        aria-pressed={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btn(editor.isActive('underline'))}
      >
        <u>U</u>
      </button>
      <span className={sep} />
      <button
        type='button'
        aria-label='Heading 1'
        aria-pressed={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btn(editor.isActive('heading', { level: 1 }))}
      >
        H1
      </button>
      <button
        type='button'
        aria-label='Heading 2'
        aria-pressed={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btn(editor.isActive('heading', { level: 2 }))}
      >
        H2
      </button>
      <span className={sep} />
      <button
        type='button'
        aria-label='Bullet list'
        aria-pressed={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btn(editor.isActive('bulletList'))}
      >
        • List
      </button>
      <button
        type='button'
        aria-label='Numbered list'
        aria-pressed={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btn(editor.isActive('orderedList'))}
      >
        1. List
      </button>
      <span className={sep} />
      <button
        type='button'
        aria-label={editor.isActive('link') ? 'Remove link' : 'Insert link'}
        aria-pressed={editor.isActive('link')}
        onClick={handleLink}
        className={btn(editor.isActive('link'))}
      >
        {editor.isActive('link') ? 'Unlink' : 'Link'}
      </button>
      <button
        type='button'
        aria-label='Blockquote'
        aria-pressed={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btn(editor.isActive('blockquote'))}
      >
        Quote
      </button>
      <button
        type='button'
        aria-label='Horizontal rule'
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={btn(false)}
      >
        —
      </button>
    </div>
  );
}

export default function RichTextEditor({ name, defaultValue }: RichTextEditorProps) {
  const [htmlContent, setHtmlContent] = useState(defaultValue ?? '');

  const editor = useEditor({
    extensions: [StarterKit, Underline, Link.configure({ openOnClick: false, autolink: true })],
    content: defaultValue ?? '',
    immediatelyRender: false,
    onUpdate({ editor }) {
      setHtmlContent(editor.getHTML());
    },
  });

  return (
    <div className='overflow-hidden rounded-lg border border-black/10 focus-within:ring-2 focus-within:ring-foreground/20 dark:border-white/10 dark:bg-transparent'>
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
      <input type='hidden' name={name} value={htmlContent} />
    </div>
  );
}
