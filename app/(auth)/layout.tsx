export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container flex justify-center items-center min-h-screen/0.5 p-10">
      {children}
    </div>
  );
}
