import { createAuthClient } from "better-auth/react";

// baseURL is omitted intentionally: the client defaults to the current origin,
// which is correct for both local dev and deployment.
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
