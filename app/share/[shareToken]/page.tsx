// Public, read-only shared note view. No auth required (excluded from proxy).
// params is a Promise in Next 16 and must be awaited.
export default async function SharedNotePage({
  params,
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = await params;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <p className="text-sm text-zinc-500">Shared note</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        Public note {shareToken}
      </h1>
      <p className="mt-4 text-zinc-500">
        The shared note&apos;s content will render here, read-only.
      </p>
    </main>
  );
}
