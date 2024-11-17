'use server';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import AnimatedLogo from '@/components/AnimatedLogo';
import HelpWantedRequest from './HelpWantedRequest';
import { auth } from '@/auth';
import getXpStats from '@/app/_helpers/experience-calculator';
import { redirect } from 'next/navigation';
import BACKEND_URL from '@/app/_helpers/backend-path';
import { headers } from 'next/headers';
import { UsersSchema } from '@/app/lib/schemas/Users';

const expertise = ['Testemunha', 'Conhecimento Local'];

// Mock data for personalized assistance requests
const mockRequests = [
	{
		id: 1,
		title: 'Testemunha Necessária para Assalto na Rua Principal',
		description:
			'Estamos buscando testemunhas que possam ter visto um assalto que ocorreu na Rua Principal em 15 de junho por volta das 22:00. Seu conhecimento local pode ser crucial para resolver este caso.',
		location: 'Rua Principal',
		urgency: 'Alta',
		matchScore: 95,
		skillsNeeded: ['Conhecimento Local', 'Observação'],
	},
	{
		id: 2,
		title: 'Informações sobre Veículo Suspeito na Área do Centro',
		description:
			'Estamos em busca de informações sobre um sedã azul com a placa ABC-123 visto na área central em várias ocasiões. Sua familiaridade com a área pode fornecer informações valiosas.',
		location: 'Centro',
		urgency: 'Média',
		matchScore: 88,
		skillsNeeded: ['Conhecimento Local', 'Atenção aos Detalhes'],
	},
	{
		id: 3,
		title: 'Ajuda para Identificar Suspeito de Filmagem de Segurança',
		description:
			'Precisamos de ajuda para identificar um suspeito capturado em filmagens de segurança próximo ao Parque Central. Sua experiência como testemunha em casos anteriores faz de você um candidato ideal para ajudar nesta investigação.',
		location: 'Parque Central',
		urgency: 'Alta',
		matchScore: 92,
		skillsNeeded: ['Experiência como Testemunha', 'Identificação Visual'],
	},
];

export default async function HelpWanted() {
	const requests = mockRequests;
	const session = await auth();
	const user = session?.user;

	if (!user) {
		redirect('/no-permission?redirect_to=/my-profile');
	}

	const myHeaders = await headers();

	const res = await fetch(BACKEND_URL + '/db/users/' + user._id, {
		method: 'GET',
		headers: myHeaders,
	});
	const userData = (await res.json()).user as UsersSchema;

	const expStats = getXpStats(userData.experience);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<Link href="/my-profile">
						<Button variant="ghost" className="gap-2">
							<ArrowLeft className="h-4 w-4" />
							Voltar à minha página
						</Button>
					</Link>
					<Link href="/">
						<h1 className="text-3xl font-bold text-primary">
							<AnimatedLogo className="inline" />
						</h1>
					</Link>
				</div>

				<div className="grid gap-6 md:grid-cols-3">
					<Card className="md:col-span-2">
						<CardHeader>
							<CardTitle className="text-2xl">
								Solicitações de Ajuda Personalizadas
							</CardTitle>
							<CardDescription>
								Essas solicitações combinam com sua experiência
								e localização
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{requests.map((request) => (
									<HelpWantedRequest
										request={request}
										key={`HelpWantedRequest-${request.id}`}
									/>
								))}
							</div>
						</CardContent>
					</Card>

					{user && (
						<Card>
							<CardHeader>
								<CardTitle className="text-xl">
									Seu Perfil
								</CardTitle>
								<CardDescription>
									Seu impacto nas investigações
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center space-x-4">
									<Avatar className="h-20 w-20">
										{/* <AvatarImage
											src={user.avatar}
											alt={user.name}
										/> */}
										<AvatarFallback>
											{user.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div>
										<h3 className="text-lg font-semibold">
											{user.name}
										</h3>
										<p className="text-sm text-muted-foreground flex items-center">
											<MapPin className="h-4 w-4 mr-1" />
											Toledo-PR
										</p>
									</div>
								</div>
								<div>
									<h4 className="font-semibold mb-2">
										Sua Experiência
									</h4>
									<div className="flex flex-wrap gap-2">
										{expertise.map((skill) => (
											<Badge
												key={skill}
												variant="secondary"
											>
												{skill}
											</Badge>
										))}
									</div>
								</div>
								<div>
									<h4 className="font-semibold mb-2">
										Pontuação de Contribuição
									</h4>
									<div className="flex items-center">
										<Progress
											value={
												(userData.experience * 100) /
												expStats.xpForNextLevel
											}
											className="flex-grow mr-4"
										/>
									</div>
									<span className="text-sm font-semibold">
										{`Level: ${expStats.currentLevel} - ${userData.experience} / ${expStats.xpForNextLevel}`}
									</span>
								</div>
							</CardContent>
							<CardFooter>
								<p className="text-sm text-muted-foreground">
									Suas contribuições estão fazendo uma
									diferença significativa nas investigações.
									Obrigado pelo seu apoio contínuo!
								</p>
							</CardFooter>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
