import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Nav from "@/components/Nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth");
  }

  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">{children}</div>
    </div>
  );
}
