import Nav from "@/components/Nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">{children}</div>
    </div>
  );
}
