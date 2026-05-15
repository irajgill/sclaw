import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ZeroForge, your sovereignclaw — sovereign agents on 0G',
    template: '%s · ZeroForge',
  },
  description:
    'ZeroForge gives 0G developers sovereign memory, swarm coordination, iNFT lifecycle, reflection loops, and a visual builder — in five composable packages, with a working agent in under 10 minutes.',
  metadataBase: new URL('https://sovereignclaw.dev'),
  openGraph: {
    title: 'ZeroForge, your sovereignclaw — sovereign agents on 0G',
    description:
      'Five composable packages, encrypted memory revocable on-chain, ERC-7857 iNFT lifecycle, streaming TEE-verified inference, working agent in <10 min.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
