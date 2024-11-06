import Provider from '@/components/provider';
import Footer from '@/components/footer';
import { Metadata } from 'next';
import "./globals.css";
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

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
    <html lang="en" className="overscroll-none dark">
      <body className="antialiased min-h-screen flex flex-col">
        <Provider>
          {children}
          <Footer/>
        </Provider>
      </body>
    </html>
  );
}
