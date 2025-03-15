import { Search, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import BACKEND_URL from '@/app/_helpers/backend-path';
import { AnswerRequestSchemaInterface } from '@/app/lib/schemas/AnswerRequests';
import { format } from 'date-fns';
import ActiveAssistanceRequestsMap from '@/components/ActiveAssistanceRequests/ActiveAssistanceRequestsMap';

export default async function ActiveAssistanceRequests() {
	const session = await auth();
	const user = session?.user;

	if (!user) {
		redirect('/no-permission?redirect_to=/my-profile');
	}

	const headersList = headers();
	const authHeader = (await headersList).get('authorization');
	const cookieHeader = (await headersList).get('cookie');

	const resAnswerRequests = await fetch(
		BACKEND_URL + '/db/answer-requests?id=' + user._id,
		{
			method: 'GET',
			headers: {
				authorization: authHeader || '',
				cookie: cookieHeader || '',
			},
		}
	);

	const myAnswerRequests = (await resAnswerRequests.json()) as {
		answerRequests: AnswerRequestSchemaInterface[];
		total: number;
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Buscar Solicitações de Assistência</CardTitle>
					<CardDescription>
						Encontre solicitações de assistência específicas
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex space-x-2">
						<Input
							type="text"
							placeholder="Pesquisar solicitações..."
							// value={searchQuery}
							// onChange={(e) => setSearchQuery(e.target.value)}
							className="flex-grow"
						/>
						<Button>
							<Search className="h-4 w-4 mr-2" />
							Buscar
						</Button>
					</div>
				</CardContent>
			</Card>

			<div className="grid md:grid-cols-2 gap-6">
				<div>
					<Card>
						<CardHeader>
							<CardTitle>Mapa de Solicitações</CardTitle>
							<CardDescription>
								Localizações das solicitações de assistência
								ativas
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="h-[400px]">
								<ActiveAssistanceRequestsMap
									requests={myAnswerRequests.answerRequests}
								/>
							</div>
						</CardContent>
					</Card>
				</div>

				<div>
					<Card>
						<CardHeader>
							<CardTitle>Lista de Solicitações</CardTitle>
							<CardDescription>
								Detalhes das solicitações de assistência ativas
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ScrollArea className="h-[400px]">
								<div className="space-y-4">
									{myAnswerRequests.answerRequests.map(
										(request) => (
											<Card key={request._id as string}>
												<CardHeader>
													<CardTitle>
														{request.title}
													</CardTitle>
													{request.createdAt !==
														undefined && (
														<CardDescription>
															Criado em:{' '}
															{format(
																request.createdAt,
																'dd/MM/yyyy HH:mm'
															)}
														</CardDescription>
													)}
												</CardHeader>
												<CardContent>
													<p>{request.message}</p>
													<div className="flex items-center mt-2 space-x-4">
														<Badge variant="secondary">
															<MapPin className="h-4 w-4 mr-1" />
															{
																request.requestRadius
															}
															m raio
														</Badge>
														{/* <Badge variant="outline">
															<Users className="h-4 w-4 mr-1" />
															{
																request.respondents
															}{' '}
															respondentes
														</Badge> */}
													</div>
												</CardContent>
												<CardFooter>
													<Button
														variant="outline"
														className="w-full"
													>
														Ver Detalhes
													</Button>
												</CardFooter>
											</Card>
										)
									)}
								</div>
							</ScrollArea>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
}
