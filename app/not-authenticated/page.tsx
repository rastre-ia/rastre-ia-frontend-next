import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function NotAuthenticated({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const redirect_to = (await searchParams).redirect_to;

	const loginLink = redirect_to
		? `/login?redirect_to=${redirect_to}`
		: '/login';

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<AlertCircle className="h-5 w-5 text-yellow-500" />
						Não Autenticado
					</CardTitle>
					<CardDescription>
						Você precisa estar logado para acessar esta página.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Por favor, faça login para acessar este conteúdo e
						utilizar todas as funcionalidades do RastreIA.
					</p>
				</CardContent>
				<CardFooter>
					<Button asChild className="w-full">
						<Link href={loginLink}>Fazer Login</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
