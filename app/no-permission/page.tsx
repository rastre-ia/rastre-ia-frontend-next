import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function NoPermission() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<ShieldAlert className="h-5 w-5 text-red-500" />
						Acesso Negado!
					</CardTitle>
					<CardDescription>
						Você não tem permissão para acessar esta página.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Se você acredita que isso é um erro, por favor, contate
						o administrador ou retorne à página inicial.
					</p>
				</CardContent>
				<CardFooter>
					<Button asChild className="w-full">
						<Link href="/">Retornar à Página Inicial</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
