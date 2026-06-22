import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import EditNoteForm from "./EditNoteForm";

export default async function NoteEditPage({
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
      <h1 className="text-2xl font-semibold tracking-tight">Edit note</h1>
      <EditNoteForm
        id={id}
        initialTitle={note.title}
        initialContent={note.content}
      />
    </section>
  );
}
