'use client';
import { FunctionComponent } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useSession, SessionProvider } from 'next-auth/react';
import { signOut } from 'next-auth/react';

interface LoginAvatarProps {}

const LoginAvatar: FunctionComponent<LoginAvatarProps> = () => {
	const session = useSession();

	if (session.status === 'authenticated') {
		console.log(session);

		return (
			<SessionProvider>
				<Button
					onClick={() => {
						signOut();
					}}
				>
					Sair
				</Button>
			</SessionProvider>
		);
	}

	return (
		<Link href="/login">
			<Button>Entrar</Button>
		</Link>
	);
};

export default LoginAvatar;
