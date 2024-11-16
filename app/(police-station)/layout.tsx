import { auth } from '@/auth';
import RolesEnum from '../lib/schemas/helpers/RolesEnum';
import { redirect } from 'next/navigation';

export default async function PoliceStationLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	const user = session?.user;

	if (!user) {
		redirect('/not-authenticated');
	}

	if (user.role !== RolesEnum.POLICE_STATION) {
		redirect('/no-permission');
	}
	return <>{children}</>;
}
