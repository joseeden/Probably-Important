/**
 * Returns true when the given userId owns the note.
 * Used as the authorization guard in every note mutation action.
 */
export function ownsNote(note: { userId: string }, userId: string): boolean {
  return note.userId === userId;
}

/**
 * Determines the shareToken to persist when toggling public sharing.
 *
 * - Toggling ON with no existing token → generate a fresh UUID
 * - Toggling ON with existing token    → reuse it (idempotent)
 * - Toggling OFF                       → preserve the current token
 *   so re-enabling sharing gives the same URL
 */
export function computeShareToken(currentToken: string | null, isPublic: boolean): string | null {
  if (!isPublic) return currentToken;
  return currentToken ?? crypto.randomUUID();
}
