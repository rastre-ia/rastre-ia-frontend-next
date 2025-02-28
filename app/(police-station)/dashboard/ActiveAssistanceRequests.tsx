'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { format } from 'date-fns';
import ActiveAssistanceRequestsMap from '@/components/ActiveAssistanceRequests/ActiveAssistanceRequestsMap';
import BACKEND_URL from '@/app/_helpers/backend-path';
import { AnswerRequestSchemaInterface } from '@/app/lib/schemas/AnswerRequests';

export default function ActiveAssistanceRequests() {
	const [myAnswerRequests, setMyAnswerRequests] = useState<
		AnswerRequestSchemaInterface[]
	>([]);
	const router = useRouter();

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const res = await fetch(`${BACKEND_URL}/db/answer-requests`, {
					method: 'GET',
					credentials: 'include',
				});

				if (!res.ok) {
					throw new Error('Erro ao buscar solicitações.');
				}

				const data = await res.json();
				setMyAnswerRequests(data.answerRequests || []);
			} catch (error) {
				console.error('Erro ao buscar solicitações:', error);
			}
		};

		fetchRequests();
	}, []);

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
									requests={myAnswerRequests}
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
									{myAnswerRequests.map((request) => (
										<Card key={request._id as string}>
											<CardHeader>
												<CardTitle>
													{request.title}
												</CardTitle>
												{request.createdAt && (
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
														{request.requestRadius}m
														raio
													</Badge>
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
									))}
								</div>
							</ScrollArea>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
}
