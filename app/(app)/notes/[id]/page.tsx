import Link from "next/link";

// Placeholder note view. params is a Promise in Next 16 and must be awaited.
export default async function NoteViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Note {id}</h1>
      <p className="mt-4 text-zinc-500">
        Read-only note content will render here.
      </p>
      <div className="mt-6 flex gap-4 text-sm">
        <Link
          href={`/notes/${id}/edit`}
          className="font-medium text-foreground underline underline-offset-4"
        >
          Edit
        </Link>
      </div>
    </section>
  );
}
