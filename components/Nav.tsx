"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export default function Nav() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/auth");
    router.refresh();
  }

  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
          Probably Important
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <button
            type="button"
            onClick={handleSignOut}
            className="font-medium text-zinc-500 hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      </nav>
    </header>
  );
}
