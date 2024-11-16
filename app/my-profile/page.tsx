import Link from 'next/link';
import {
	Handshake,
	FileText,
	TrendingUp,
	User,
	Smartphone,
	LogOut,
	AlertTriangle,
	Award,
} from 'lucide-react';

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
import { findUserActivitiesByUserId } from '../_helpers/db/user-activities';
import { ActivityTypeEnum } from '../lib/schemas/UserActivities';
import { format } from 'date-fns';
import getXpStats from '../_helpers/experience-calculator';
import { getStolenItemsStatus } from '../_helpers/db/stolen-items';

function getUserActivityTitle(userAct: ActivityTypeEnum) {
	switch (userAct) {
		case ActivityTypeEnum.ANSWER_REQUEST:
			return 'Respondeu a um pedido de ajuda';
		case ActivityTypeEnum.CREATE_REPORT:
			return 'Criou um relato';
		case ActivityTypeEnum.REGISTER_STOLEN_ITEM:
			return 'Registrou um item roubado';
		default:
			return 'Outro';
	}
}

const badges = ['Primeiro Relato', 'Guardião do silêncio', 'Investigador'];

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

	const userActivities = await findUserActivitiesByUserId(
		user._id,
		myHeaders
	);

	const expStats = getXpStats(userData.experience);

	const stolenItemsIds = userActivities
		.map((activity) => {
			if (activity.activityType === ActivityTypeEnum.REGISTER_STOLEN_ITEM)
				return activity.stolenItemId;
		})
		.filter((item) => item);

	const stolenItemsStatus = await getStolenItemsStatus(
		stolenItemsIds as string[],
		myHeaders
	);

	console.log(stolenItemsStatus);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
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
										Cidadão{' '}
										<div className="inline text-blue-600 font-bold">
											Nível {expStats.currentLevel}
										</div>
									</p>
								</div>
							</div>
							<div>
								<div className="flex justify-between mb-1">
									<span className="text-sm font-medium">
										Progresso de XP
									</span>
									<span className="text-sm font-medium">
										{userData.experience} /{' '}
										{expStats.xpForNextLevel}
									</span>
								</div>
								<Progress
									value={expStats.progressToNextLevel * 100}
								/>
							</div>
							<div>
								<h3 className="font-semibold mb-2">
									Conquistas
								</h3>
								<div className="flex flex-wrap gap-2">
									{badges.map((badge) => (
										<Badge key={badge} variant="secondary">
											<Award className="mr-1 h-3 w-3" />
											{badge}
										</Badge>
									))}
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Atividades Recentes</CardTitle>
						</CardHeader>
						<CardContent className="h-52 overflow-y-auto">
							<ul className="space-y-4">
								{userActivities.map((activity, index) => (
									<li
										key={index}
										className="flex items-start space-x-3"
									>
										{activity.activityType ===
											ActivityTypeEnum.ANSWER_REQUEST && (
											<Handshake className="h-5 w-5 text-green-600" />
										)}
										{activity.activityType ===
											ActivityTypeEnum.CREATE_REPORT && (
											<FileText className="h-5 w-5 text-blue-600" />
										)}
										{activity.activityType ===
											ActivityTypeEnum.REGISTER_STOLEN_ITEM && (
											<Smartphone className="h-5 w-5 text-red-600" />
										)}
										<div>
											<p className="text-sm font-medium">
												{getUserActivityTitle(
													activity.activityType
												)}
											</p>
											{activity.createdAt !==
												undefined && (
												<p className="text-xs text-muted-foreground">
													{format(
														activity.createdAt,
														'dd/MM/yyyy HH:mm'
													)}
												</p>
											)}
										</div>
									</li>
								))}
							</ul>
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
											<Smartphone className="mr-2 h-4 w-4" />
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
								<div className="flex items-center text-green-600">
									<TrendingUp className="mr-2 h-4 w-4" />
									<span className="font-medium">
										Suas contribuições aumentaram 20% este
										mês!
									</span>
								</div>
							</CardDescription>
						</CardHeader>
						<CardContent className="h-52 space-y-4 overflow-y-auto">
							<div className="flex items-center justify-between">
								<span className="font-medium">
									Relatórios Enviados
								</span>
								<Badge variant="secondary">15</Badge>
							</div>
							<hr />
							<div className="flex items-center justify-between">
								<span className="font-medium">
									Itens Roubados
								</span>
								<Badge variant="secondary">3</Badge>
							</div>
							<hr />
							<div className="flex items-center justify-between">
								<span className="font-medium">
									Itens Recuperados
								</span>
								<Badge variant="secondary">3</Badge>
							</div>
							<hr />
							<div className="flex items-center justify-between">
								<span className="font-medium">
									Investigações Auxiliadas
								</span>
								<Badge variant="secondary">7</Badge>
							</div>
							<hr />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
