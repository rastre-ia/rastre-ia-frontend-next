'use server';

import { ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import BACKEND_URL from '@/app/_helpers/backend-path';
import getXpStats from '@/app/_helpers/experience-calculator';
import { AnswerRequestSchemaInterface } from '@/app/lib/schemas/AnswerRequests';
import { AnswersSchemaInterface } from '@/app/lib/schemas/Answers';
import { UsersSchema } from '@/app/lib/schemas/Users';
import { auth } from '@/auth';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import HelpWantedRequest from './HelpWantedRequest';

const expertise = ['Testemunha', 'Conhecimento Local'];

function checkIfAnswered(
	answerRequestId: string,
	myAnswers: AnswersSchemaInterface[]
) {
	return myAnswers.find(
		(element) => element.answerRequestId === answerRequestId
	)
		? true
		: false;
}

export default async function HelpWanted() {
	const session = await auth();
	const user = session?.user;

	if (!user) {
		redirect('/no-permission?redirect_to=/my-profile');
	}

	const myHeaders = await headers();

	const resUsers = await fetch(BACKEND_URL + '/db/users/' + user._id, {
		method: 'GET',
		headers: new Headers(myHeaders),
	});
	const userData = (await resUsers.json()).user as UsersSchema;

	const resAnswerRequests = await fetch(
		BACKEND_URL + '/db/answer-requests?id=' + user._id,
		{
			method: 'GET',
			headers: new Headers(myHeaders),
		}
	);
	const myAnswerRequests = (await resAnswerRequests.json()) as {
		answerRequests: AnswerRequestSchemaInterface[];
		total: number;
	};

	const resMyAnswers = await fetch(
		BACKEND_URL + '/db/answers?id=' + user._id,
		{
			method: 'GET',
			headers: new Headers(myHeaders),
		}
	);
	const myAnswers = (await resMyAnswers.json()) as {
		answers: AnswersSchemaInterface[];
	};

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
								{myAnswerRequests.answerRequests.map(
									(request) => (
										<HelpWantedRequest
											userId={user._id}
											request={request} //teste
											answered={checkIfAnswered(
												request._id as string,
												myAnswers.answers
											)}
											myHeaders={myHeaders}
											key={`HelpWantedRequest-${request._id}`}
										/>
									)
								)}
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
