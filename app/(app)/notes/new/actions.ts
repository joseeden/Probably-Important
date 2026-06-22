"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  content: z.string(),
});

export async function createNote(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth");

  const result = schema.safeParse({
    title: formData.get("title"),
    content: formData.get("content") ?? "",
  });

  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Invalid input" };
  }

  const note = await db.note.create({
    data: {
      title: result.data.title,
      content: result.data.content,
      userId: session.user.id,
      isPublic: false,
    },
  });

  redirect(`/notes/${note.id}`);
}
