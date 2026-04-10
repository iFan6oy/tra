import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/lib/auth-context";
import { withAuth } from "@workos-inc/authkit-nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TRA - Travel Reimbursement Application",
  description: "Manage travel requests, approvals, and reimbursements",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Try to get WorkOS session - returns null if not configured or not logged in
  let workosUser = null;
  try {
    const session = await withAuth();
    workosUser = session?.user || null;
  } catch {
    // WorkOS not configured yet - dev mode, continue without auth
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        <AuthProvider workosUser={workosUser}>
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
