import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pixelverse",
  description: "Explore an infinite universe of pixels",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="h-screen bg-gray-900 p-8 text-white">
          <a href="/">
            <h1 className="text-xl font-bold leading-7 text-white sm:truncate sm:text-2xl sm:tracking-tight">
              Pixelverse
            </h1>
          </a>
          {children}
        </main>
      </body>
    </html>
  );
}
