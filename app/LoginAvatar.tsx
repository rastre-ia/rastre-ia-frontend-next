import { FunctionComponent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { auth } from '@/auth';
interface LoginAvatarProps {}

const LoginAvatar: FunctionComponent<LoginAvatarProps> = async () => {
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

	return (
		<Link href={'/my-profile'}>
			<Button>Meu perfil</Button>
		</Link>
	);
};

export default LoginAvatar;
