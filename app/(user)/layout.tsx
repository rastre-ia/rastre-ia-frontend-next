import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import RolesEnum from '../lib/schemas/helpers/RolesEnum';

export default async function UserLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	const user = session?.user;

	if (!user) {
		redirect('/not-authenticated');
	}

	if (user.role !== RolesEnum.USER) {
		redirect('/no-permission');
	}
	return <>{children}</>;
}
