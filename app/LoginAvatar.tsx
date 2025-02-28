'use client';

import { FunctionComponent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { auth } from '@/auth';
import RolesEnum from './lib/schemas/helpers/RolesEnum';
import React from 'react';
interface LoginAvatarProps {}

const LoginAvatar: FunctionComponent<LoginAvatarProps> = () => {
	const [session, setSession] = React.useState<any>(null);

	React.useEffect(() => {
		const getSession = async () => {
			const session = await auth();
			setSession(session);
		};

		getSession();
	}, []);

	if (!session) {
		return (
			<>
				<Link href="/signup">
					<Button variant="outline">Registre-se</Button>
				</Link>
				<Link href="/login">
					<Button>Entrar</Button>
				</Link>
			</>
		);
	}

	const user = session.user;

	if (user.role === RolesEnum.USER) {
		return (
			<Link href={'/my-profile'}>
				<Button>Meu perfil</Button>
			</Link>
		);
	}

	return (
		<Link href={'/dashboard'}>
			<Button>Dashboard</Button>
		</Link>
	);
};

export default LoginAvatar;
