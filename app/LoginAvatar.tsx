'use client';
import { FunctionComponent } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

interface LoginAvatarProps {}

const LoginAvatar: FunctionComponent<LoginAvatarProps> = () => {
	const { data: session, status } = useSession();

	if (status === 'authenticated') {
		console.log(session);

		return <p>Signed in as {session?.user ? session.user.name : 'A'}</p>;
	}

	return (
		<Link href="/login">
			<Button>Entrar</Button>
		</Link>
	);
};

export default LoginAvatar;
