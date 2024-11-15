import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, FileText, TrendingUp, User, LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import AnimatedLogo from '@/components/AnimatedLogo';
import { auth, signOut } from '@/auth';
import BACKEND_URL from '../_helpers/backend-path';
import { headers } from 'next/headers';
import { UsersType } from '../lib/schemas/Users';

// Definição dos tipos de dados do usuário
interface UserData {
	name: string;
	avatar: string;
	level: number;
	xp: number;
	xpToNextLevel: number;
	badges: string[];
	recentActivities: { type: string; description: string; date: string }[];
}

const mockUser: UserData = {
	name: 'Reinaldo K. N.',
	avatar: '/placeholder-user.jpg',
	level: 5,
	xp: 750,
	xpToNextLevel: 1000,
	badges: ['Herói Local', 'Olho Afiado', 'Primeiro a Responder'],
	recentActivities: [
		{
			type: 'report',
			description: 'Enviou um relatório sobre atividade suspeita',
			date: '2023-06-15',
		},
		{
			type: 'item',
			description: 'Registrou um laptop roubado',
			date: '2023-06-10',
		},
		{
			type: 'help',
			description: 'Ajudou a localizar uma pessoa desaparecida',
			date: '2023-06-05',
		},
	],
};

export default async function MyProfile() {
	const session = await auth();
	const user = session?.user;

	if (!user) return <div> Você não está autenticado </div>;

	const myHeaders = await headers();

	const res = await fetch(BACKEND_URL + '/db/users/' + user._id, {
		method: 'GET',
		headers: myHeaders,
	});
	const userData = (await res.json()).user as UsersType;

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
			<div className="flex justify-between items-center mb-6">
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
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Perfil</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center space-x-4">
							<Avatar className="h-20 w-20">
								{/* <AvatarImage
										src={user.avatar}
										alt={user.name}
									/> */}
								<AvatarFallback>
									{userData.name.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div>
								<h2 className="text-2xl font-semibold">
									{userData.name}
								</h2>
								<p className="text-muted-foreground">
									Nível {userData.experience} Cidadão
								</p>
							</div>
						</div>
						<div>
							<div className="flex justify-between mb-1">
								<span className="text-sm font-medium">
									Progresso de XP
								</span>
								<span className="text-sm font-medium">
									{1} / {12}
								</span>
							</div>
							<Progress value={(1 / 12) * 100} />
						</div>
						<div>
							<h3 className="font-semibold mb-2">Conquistas</h3>
							<div className="flex flex-wrap gap-2">
								{/* {user.badges.map((badge) => (
									<Badge key={badge} variant="secondary">
										<Award className="mr-1 h-3 w-3" />
										{badge}
									</Badge>
								))} */}
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Atividades Recentes</CardTitle>
					</CardHeader>
					<CardContent>
						{/* <ul className="space-y-4">
							{user.recentActivities.map((activity, index) => (
								<li
									key={index}
									className="flex items-start space-x-3"
								>
									{activity.type === 'report' && (
										<AlertTriangle className="h-5 w-5 text-yellow-500" />
									)}
									{activity.type === 'item' && (
										<Shield className="h-5 w-5 text-blue-500" />
									)}
									{activity.type === 'help' && (
										<User className="h-5 w-5 text-green-500" />
									)}
									<div>
										<p className="text-sm font-medium">
											{activity.description}
										</p>
										<p className="text-xs text-muted-foreground">
											{activity.date}
										</p>
									</div>
								</li>
							))}
						</ul> */}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Ações Rápidas</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<ul className="space-y-2">
							<li>
								<Link href="/register-item">
									<Button
										className="w-full"
										variant="outline"
									>
										<Shield className="mr-2 h-4 w-4" />
										Registrar item roubado
									</Button>
								</Link>
							</li>

							<li>
								<Link href="/new-report">
									<Button
										className="w-full"
										variant="outline"
									>
										<FileText className="mr-2 h-4 w-4" />
										Enviar um relato
									</Button>
								</Link>
							</li>

							<li>
								<Link href="/help-wanted">
									<Button className="w-full">
										<User className="mr-2 h-4 w-4" />
										Ajudar em Investigação
									</Button>
								</Link>
							</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Seu Impacto</CardTitle>
						<CardDescription>
							Veja como você está fazendo a diferença
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<span className="font-medium">
								Relatórios Enviados
							</span>
							<Badge variant="secondary">15</Badge>
						</div>
						<div className="flex items-center justify-between">
							<span className="font-medium">
								Itens Recuperados
							</span>
							<Badge variant="secondary">3</Badge>
						</div>
						<div className="flex items-center justify-between">
							<span className="font-medium">
								Investigações Auxiliadas
							</span>
							<Badge variant="secondary">7</Badge>
						</div>
						<div className="flex items-center text-green-600">
							<TrendingUp className="mr-2 h-4 w-4" />
							<span className="font-medium">
								Suas contribuições aumentaram 20% este mês!
							</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
