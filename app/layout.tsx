import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import './globals.css';

export const metadata: Metadata = {
	title: 'RastreIA',
	description: 'RastreIA - Plataforma de rastreamento de objetos roubados',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-br">
			<body
			// className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<SessionProvider>{children}</SessionProvider>
				<Toaster />
			</body>
		</html>
	);
}
