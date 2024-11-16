'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
	ArrowLeft,
	MessageSquare,
	User,
	MapPin,
	Star,
	Clock,
} from 'lucide-react';
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import AnimatedLogo from '@/components/AnimatedLogo';

// Mock user data
const mockUser = {
	name: 'Reinaldo K. N.',
	avatar: '/placeholder-user.jpg',
	location: 'Centro',
	expertise: ['Testemunha', 'Conhecimento Local'],
	contributionScore: 75,
};

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

export default function HelpWanted() {
	const [requests, setRequests] = useState(mockRequests);
	const [user, setUser] = useState(mockUser);

	const handleSubmitResponse = (requestId: number, response: string) => {
		console.log(
			`Resposta enviada para a solicitação ${requestId}:`,
			response
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-6xl mx-auto"
			>
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
									<Card key={request.id}>
										<CardHeader>
											<div className="flex justify-between items-start">
												<div>
													<CardTitle>
														{request.title}
													</CardTitle>
													<CardDescription className="flex items-center mt-1">
														<MapPin className="h-4 w-4 mr-1" />
														{request.location}
													</CardDescription>
												</div>
												<Badge
													variant={
														request.urgency ===
														'Alta'
															? 'destructive'
															: 'secondary'
													}
												>
													Urgência {request.urgency}
												</Badge>
											</div>
										</CardHeader>
										<CardContent>
											<p className="mb-4">
												{request.description}
											</p>
											<div className="flex flex-wrap gap-2 mb-4">
												{request.skillsNeeded.map(
													(skill) => (
														<Badge
															key={skill}
															variant="outline"
														>
															{skill}
														</Badge>
													)
												)}
											</div>
											<div className="flex items-center justify-between">
												<div className="flex items-center">
													<Star className="h-4 w-4 text-yellow-400 mr-1" />
													<span className="font-semibold">
														{request.matchScore}% de
														Combinação
													</span>
												</div>
												<Dialog>
													<DialogTrigger asChild>
														<Button>
															<MessageSquare className="h-4 w-4 mr-2" />
															Responder
														</Button>
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>
																Responder à
																Solicitação
															</DialogTitle>
															<DialogDescription>
																Suas informações
																são cruciais
																para esta
																investigação.
																Por favor,
																forneça qualquer
																informação
																relevante sobre
																esta
																solicitação.
															</DialogDescription>
														</DialogHeader>
														<form
															onSubmit={(e) => {
																e.preventDefault();
																const response =
																	(
																		e.target as HTMLFormElement
																	).response
																		.value;
																handleSubmitResponse(
																	request.id,
																	response
																);
																(
																	e.target as HTMLFormElement
																).reset();
															}}
														>
															<Textarea
																name="response"
																placeholder="Digite sua resposta aqui..."
																className="mb-4"
															/>
															<Button type="submit">
																Enviar Resposta
															</Button>
														</form>
													</DialogContent>
												</Dialog>
											</div>
										</CardContent>
									</Card>
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
										<AvatarImage
											src={user.avatar}
											alt={user.name}
										/>
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
											{user.location}
										</p>
									</div>
								</div>
								<div>
									<h4 className="font-semibold mb-2">
										Sua Experiência
									</h4>
									<div className="flex flex-wrap gap-2">
										{user.expertise.map((skill) => (
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
											value={user.contributionScore}
											className="flex-grow mr-4"
										/>
										<span className="font-semibold">
											{user.contributionScore}%
										</span>
									</div>
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
			</motion.div>
		</div>
	);
}
