import { auth } from '@/auth';
import Link from 'next/link';
import RolesEnum from '../lib/schemas/helpers/RolesEnum';
import { redirect } from 'next/navigation';

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
