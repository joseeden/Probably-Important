import { describe, it, expect } from 'vitest';
import { ownsNote, computeShareToken } from '@/lib/note-utils';

describe('ownsNote', () => {
  it('returns true when userId matches', () => {
    expect(ownsNote({ userId: 'user-1' }, 'user-1')).toBe(true);
  });

  it('returns false when userId differs', () => {
    expect(ownsNote({ userId: 'user-1' }, 'user-2')).toBe(false);
  });

  it('returns true when both are empty strings', () => {
    expect(ownsNote({ userId: '' }, '')).toBe(true);
  });
});

describe('computeShareToken', () => {
  it('returns null when toggling off with no existing token', () => {
    expect(computeShareToken(null, false)).toBeNull();
  });

  it('preserves the existing token when toggling off', () => {
    expect(computeShareToken('existing-token', false)).toBe('existing-token');
  });

  it('generates a new UUID when toggling on with no existing token', () => {
    const token = computeShareToken(null, true);
    expect(token).not.toBeNull();
    expect(typeof token).toBe('string');
    expect(token!.length).toBeGreaterThan(0);
  });

  it('generates different UUIDs on successive calls', () => {
    const a = computeShareToken(null, true);
    const b = computeShareToken(null, true);
    expect(a).not.toBe(b);
  });

  it('reuses the existing token when toggling on (idempotent)', () => {
    expect(computeShareToken('existing-token', true)).toBe('existing-token');
  });
});
