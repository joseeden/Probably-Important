import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function NoteViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth");

  const note = await db.note.findUnique({ where: { id } });
  if (!note || note.userId !== session.user.id) notFound();

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">{note.title}</h1>
      <div
        className="mt-4 text-base leading-relaxed note-content"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
      <div className="mt-6 flex gap-4 text-sm">
        <Link
          href={`/notes/${id}/edit`}
          className="font-medium text-foreground underline underline-offset-4"
        >
          Edit
        </Link>
        <Link href="/dashboard" className="font-medium text-zinc-500 underline underline-offset-4">
          Back
        </Link>
      </div>
    </section>
  );
}
