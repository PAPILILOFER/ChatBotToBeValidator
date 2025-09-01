
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat Bot To Be Validator",
  description: "To validate the format of the verb to be with regular expressions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
          {children}
      </body>
    </html>
  );
}
