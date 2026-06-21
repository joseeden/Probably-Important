import Link from "next/link";

// Placeholder dashboard. Real note list + search arrive in a later step.
const dummyNotes = [
  { id: "1", title: "Welcome to Probably Important", updatedAt: "Just now" },
  { id: "2", title: "Ideas worth keeping", updatedAt: "Yesterday" },
  { id: "3", title: "Grocery list", updatedAt: "2 days ago" },
];

export default function DashboardPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Your notes</h1>
      <ul className="mt-6 flex flex-col gap-2">
        {dummyNotes.map((note) => (
          <li key={note.id}>
            <Link
              href={`/notes/${note.id}`}
              className="flex items-center justify-between rounded-lg border border-black/10 px-4 py-3 transition-colors hover:bg-black/[.03] dark:border-white/10 dark:hover:bg-white/[.05]"
            >
              <span className="font-medium">{note.title}</span>
              <span className="text-sm text-zinc-500">{note.updatedAt}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
