import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Shivam OrthoCare, Una | Best Orthopedic Clinic",
    template: "%s | Shivam OrthoCare",
  },
  description:
    "Shivam OrthoCare provides expert orthopedic care in Una, Gujarat. Specializing in joint replacement, fracture treatment, sports injuries, spine care, and physiotherapy.",
  keywords: [
    "orthopedic clinic Una",
    "bone doctor Una",
    "joint replacement Una, Himachal Pradesh",
    "Shivam OrthoCare",
    "fracture treatment",
    "sports injury doctor",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
