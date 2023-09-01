import "./globals.css";

export const metadata = {
  title: "TBA iframe",
  description: "View your nft's TBA and it's nfts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
