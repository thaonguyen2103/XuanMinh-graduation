import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Thiệp mời tốt nghiệp · XMINH',
  description: 'Đến quẩy cùng mình trong ngày tốt nghiệp nhé!',
  openGraph: {
    title: 'Thiệp mời lễ tốt nghiệp',
    description: 'Đến quẩy cùng mình trong ngày tốt nghiệp nhé!',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Be+Vietnam+Pro:wght@400;500;700;800&family=Dancing+Script:wght@600&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
