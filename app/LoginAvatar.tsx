import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import RolesEnum from './lib/schemas/helpers/RolesEnum';
interface LoginAvatarProps {}

const LoginAvatar: FunctionComponent<LoginAvatarProps> = async ({}) => {
	const session = await auth();

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
