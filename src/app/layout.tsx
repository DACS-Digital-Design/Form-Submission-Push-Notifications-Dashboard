import Provider from '@/components/provider';
import { redirect } from 'next/navigation';
import Footer from '@/components/footer';
import { Metadata, Viewport } from 'next';
import { auth } from '@/auth';
import "./globals.css";

const APP_NAME = "Forms";
const APP_DEFAULT_TITLE = "Form Panel";
const APP_TITLE_TEMPLATE = "%s - Form Panel";
const APP_DESCRIPTION = "Contact form Viewer";


export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    startupImage: "/graphic.png"
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "hsl(var(--primary))",
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
