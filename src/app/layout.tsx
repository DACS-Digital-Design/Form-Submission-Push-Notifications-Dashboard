import Provider from '@/components/provider';
import { redirect } from 'next/navigation';
import Footer from '@/components/footer';
import { Metadata } from 'next';
import { auth } from '@/auth';
import "./globals.css";

export const metadata: Metadata = {
  title: "DACS Form Panel",
  description: "DACS Digital Design contact form viewer",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  if (!session) {
    return redirect("/api/auth/signin")
  }

  return (
    <html lang="en" suppressHydrationWarning className="overscroll-none">
      <body className="antialiased min-h-screen flex flex-col">
        <Provider session={session}>
          {children}
          <Footer/>
        </Provider>
      </body>
    </html>
  );
}
