import { describe, it, expect } from 'vitest';
import { noteSchema } from '@/lib/validations';

describe('noteSchema', () => {
  it('accepts a valid title and content', () => {
    const result = noteSchema.safeParse({ title: 'My note', content: 'Some content' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('My note');
      expect(result.data.content).toBe('Some content');
    }
  });

  it('rejects an empty title', () => {
    const result = noteSchema.safeParse({ title: '', content: 'content' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Title is required');
    }
  });

  it('accepts a title of exactly 1 character', () => {
    const result = noteSchema.safeParse({ title: 'A', content: '' });
    expect(result.success).toBe(true);
  });

  it('accepts a title of exactly 255 characters', () => {
    const result = noteSchema.safeParse({ title: 'a'.repeat(255), content: '' });
    expect(result.success).toBe(true);
  });

  it('rejects a title of 256 characters', () => {
    const result = noteSchema.safeParse({ title: 'a'.repeat(256), content: '' });
    expect(result.success).toBe(false);
  });

  it('accepts an empty content string', () => {
    const result = noteSchema.safeParse({ title: 'Title', content: '' });
    expect(result.success).toBe(true);
  });

  it('rejects when content is missing', () => {
    const result = noteSchema.safeParse({ title: 'Title' });
    expect(result.success).toBe(false);
  });
});
