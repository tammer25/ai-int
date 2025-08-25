import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Interior Designer - Transform Your Space with AI",
  description: "AI-powered interior design platform that helps you create beautiful, functional spaces tailored to your unique style and needs.",
  keywords: ["AI Interior Designer", "Interior Design", "AI Design", "Home Design", "Space Planning", "Mood Board"],
  authors: [{ name: "AI Interior Designer Team" }],
  openGraph: {
    title: "AI Interior Designer",
    description: "Transform your space with AI-powered interior design",
    url: "https://ai-interior-designer.com",
    siteName: "AI Interior Designer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Interior Designer",
    description: "Transform your space with AI-powered interior design",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
