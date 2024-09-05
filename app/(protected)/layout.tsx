import { Navbar } from "@/components/Navbar";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="container p-4">{children};</div>
    </>
  );
}
