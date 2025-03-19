'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { FunctionComponent, useMemo } from 'react';
import { handleSignOut } from './action'; // Import the server action

interface LogoutReturnButtonProps {}

const LogoutReturnButton: FunctionComponent<LogoutReturnButtonProps> = () => {
	const currentPath = usePathname();

	const numberOfLevels = useMemo(() => {
		return currentPath.split('/').length;
	}, [currentPath]);

	console.log(numberOfLevels);

	return (
		<>
			{numberOfLevels > 2 ? (
				<Button variant="outline" onClick={() => window.history.back()}>
					<ChevronLeft />
					Voltar
				</Button>
			) : (
				<form action={handleSignOut}>
					<Button variant="ghost" type="submit">
						<LogOut className="mr-2 h-4 w-4" />
						Sair
					</Button>
				</form>
			)}
		</>
	);
};

export default LogoutReturnButton;
