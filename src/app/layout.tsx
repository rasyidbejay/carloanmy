import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CarLoan.my",
    template: "%s | CarLoan.my",
  },
  description: "CarLoan.my local app shell.",
  applicationName: "CarLoan.my",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-MY" suppressHydrationWarning>
      <body className="bg-background text-foreground transition-colors duration-300">
        <Providers>
          <div className="flex min-h-screen w-full flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
