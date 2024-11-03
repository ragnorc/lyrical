import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://lyrical.sh"),
  title: "Lyrical: Language Learning Through Reading",
  description:
    "Improve language learning through AI-generated interactive reading experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
