import 'leaflet/dist/leaflet.css';
import {
	BarChart3,
	FileText,
	Locate,
	LogOut,
	PackageSearch,
	Search,
} from 'lucide-react';
import Link from 'next/link';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AnimatedLogo from '@/components/AnimatedLogo';
import LlmSearch from './LlmSearch';
import Overview from './Overview';

import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import RolesEnum from '../../lib/schemas/helpers/RolesEnum';
import ActiveAssistanceRequests from './ActiveAssistanceRequests';
import SearchReports from './SearchReports';
import SearchStolenItems from './SearchStolenItems';

export const PUBLIC_URL = process.env.VERCEL_PUBLIC_URL;

export default async function PoliceDashboard() {
	const session = await auth();
	const user = session?.user;

	if (!user) {
		return (
			<div>
				Você não está autenticado
				<Link href={'/'}>Voltar</Link>
			</div>
		);
	}

	if (
		!(
			user.role === RolesEnum.POLICE_STATION ||
			user.role === RolesEnum.ADMIN
		)
	) {
		return (
			<div>
				Você não tem permissão para acessar esta página
				<Link href={'/'}>Voltar</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
			<div className="max-w-7xl mx-auto space-y-6">
				<header className="flex justify-between items-center">
					<Link href="/">
						<h1 className="text-3xl font-bold text-primary">
							<AnimatedLogo className="inline" />
						</h1>
					</Link>
					<form
						action={async () => {
							'use server';
							await signOut({ redirectTo: '/' });
						}}
					>
						<Button variant="ghost" type="submit">
							<LogOut className="mr-2 h-4 w-4" />
							Sair
						</Button>
					</form>
				</header>
				<Tabs defaultValue="overview" className="space-y-4">
					<TabsList className="w-full flex-wrap h-full">
						<TabsTrigger value="overview">
							<BarChart3 className="h-4 w-4 mr-2" />
							Visão geral
						</TabsTrigger>
						<TabsTrigger value="search">
							<Search className="h-4 w-4 mr-2" />
							Procurar com IA
						</TabsTrigger>
						<TabsTrigger value="active-assistance-requests">
							<Locate className="h-4 w-4 mr-2" />
							Pedidos de assistência ativos
						</TabsTrigger>
						<TabsTrigger value="search-reports">
							<FileText className="h-4 w-4 mr-2" />
							Buscar reportes
						</TabsTrigger>
						<TabsTrigger value="search-stolen-items">
							<PackageSearch className="h-4 w-4 mr-2" />
							Buscar itens roubados
						</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-4">
						<Overview />
					</TabsContent>

					<TabsContent value="search" className="space-y-4">
						<LlmSearch />
					</TabsContent>

					<TabsContent
						value="active-assistance-requests"
						className="space-y-4"
					>
						<Suspense fallback={<div>Carregando...</div>}>
							<ActiveAssistanceRequests />
						</Suspense>
					</TabsContent>
					<TabsContent value="search-reports" className="space-y-4">
						<SearchReports />
					</TabsContent>
					<TabsContent
						value="search-stolen-items"
						className="space-y-4"
					>
						<SearchStolenItems />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
