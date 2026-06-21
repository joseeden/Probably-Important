// Placeholder edit view. params is a Promise in Next 16 and must be awaited.
export default async function NoteEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Edit note {id}</h1>
      <p className="mt-4 text-zinc-500">
        The note editor will live here.
      </p>
    </section>
  );
}
