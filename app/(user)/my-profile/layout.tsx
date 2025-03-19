import AnimatedLogo from '@/components/AnimatedLogo';
import Link from 'next/link';
import LogoutReturnButton from './LogoutReturnButton';

export default async function MyProfileLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<Link href="/">
						<h1 className="text-3xl font-bold text-primary">
							<AnimatedLogo className="inline" />
						</h1>
					</Link>
					<LogoutReturnButton />
				</div>
				{children}
			</div>
		</div>
	);
}
