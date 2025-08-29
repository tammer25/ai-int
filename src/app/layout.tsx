import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";

// Configure Google Fonts with optimal loading
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Optimize font loading for performance
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Optimize font loading for performance
  weight: ["300", "400", "500", "600", "700"],
});

// Enhanced metadata for SEO, branding, and accessibility
export const metadata: Metadata = {
  title: {
    default: "AI Interior Designer - Transform Your Space with AI",
    template: "%s | AI Interior Designer",
  },
  description:
    "Professional AI-powered interior design platform that creates beautiful, functional spaces tailored to your unique style, preferences, and accessibility needs. Get personalized design solutions with mood boards, 3D renders, and material selections.",
  keywords: [
    "AI Interior Designer",
    "Interior Design",
    "AI Design",
    "Home Design",
    "Space Planning",
    "Mood Board",
    "3D Renders",
    "Accessible Design",
    "Personalized Interiors",
    "Smart Home Design",
  ],
  authors: [{ name: "AI Interior Designer Team", url: "https://ai-interior-designer.com" }],
  creator: "AI Interior Designer",
  publisher: "AI Interior Designer",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Enhanced OpenGraph metadata
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-interior-designer.com",
    title: "AI Interior Designer - Transform Your Space with AI",
    description:
      "Professional AI-powered interior design platform creating beautiful, functional, and accessible spaces tailored to your unique style.",
    siteName: "AI Interior Designer",
    images: [
      {
        url: "https://ai-interior-designer.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Interior Designer - Transform your space with intelligent design solutions",
      },
    ],
  },
  // Enhanced Twitter metadata
  twitter: {
    card: "summary_large_image",
    title: "AI Interior Designer - Transform Your Space with AI",
    description:
      "Professional AI-powered interior design platform creating beautiful, functional, and accessible spaces.",
    images: ["https://ai-interior-designer.com/twitter-image.jpg"],
    creator: "@aiinteriordesign",
    site: "@aiinteriordesign",
  },
  // Additional metadata for better discovery and branding
  applicationName: "AI Interior Designer",
  category: "Design",
  classification: "Interior Design Software",
  referrer: "origin-when-cross-origin",
  verification: {
    // Add verification tokens when available
    // google: "your-google-verification-token",
    // yandex: "your-yandex-verification-token",
  },
  alternates: {
    canonical: "https://ai-interior-designer.com",
  },
};

// Viewport configuration moved from metadata
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
