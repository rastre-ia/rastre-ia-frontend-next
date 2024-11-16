'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Users, Clock } from 'lucide-react';

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

// Tipo para as solicitações simuladas de assistência
type AssistanceRequest = {
	id: number;
	title: string;
	description: string;
	location: [number, number];
	radius: number;
	respondents: number;
	createdAt: string;
};

// Função simulada para buscar solicitações ativas de assistência
const fetchAssistanceRequests = async (): Promise<AssistanceRequest[]> => {
	await new Promise((resolve) => setTimeout(resolve, 500));
	return Array(5)
		.fill(null)
		.map((_, i) => ({
			id: i + 1,
			title: `Solicitação de Assistência ${i + 1}`,
			description: `Descrição da Solicitação de Assistência ${i + 1}`,
			location: [
				51.505 + Math.random() * 0.1 - 0.05,
				-0.09 + Math.random() * 0.1 - 0.05,
			],
			radius: Math.floor(Math.random() * 1000) + 500,
			respondents: Math.floor(Math.random() * 50),
			createdAt: new Date(
				Date.now() - Math.floor(Math.random() * 86400000)
			).toLocaleString('pt-BR'),
		}));
};

export default function ActiveAssistanceRequests() {
	const [requests, setRequests] = useState<AssistanceRequest[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		loadRequests();
	}, []);

	const loadRequests = async () => {
		setIsLoading(true);
		const fetchedRequests = await fetchAssistanceRequests();
		setRequests(fetchedRequests);
		setIsLoading(false);
	};

	const handleSearch = () => {
		// Implementar a funcionalidade de busca aqui
		console.log('Buscando por:', searchQuery);
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
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="flex-grow"
						/>
						<Button onClick={handleSearch} disabled={isLoading}>
							<Search className="h-4 w-4 mr-2" />
							Buscar
						</Button>
					</div>
				</CardContent>
			</Card>

			<div className="grid md:grid-cols-2 gap-6">
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
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
								<MapContainer
									center={[51.505, -0.09]}
									zoom={11}
									style={{ height: '100%', width: '100%' }}
								>
									<TileLayer
										url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
										attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									/>
									{requests.map((request) => (
										<Circle
											key={request.id}
											center={request.location}
											radius={request.radius}
											pathOptions={{ color: 'red' }}
										>
											<Popup>
												<h3 className="font-bold">
													{request.title}
												</h3>
												<p>{request.description}</p>
											</Popup>
										</Circle>
									))}
								</MapContainer>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
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
									{requests.map((request) => (
										<Card key={request.id}>
											<CardHeader>
												<CardTitle>
													{request.title}
												</CardTitle>
												<CardDescription>
													Criado em:{' '}
													{request.createdAt}
												</CardDescription>
											</CardHeader>
											<CardContent>
												<p>{request.description}</p>
												<div className="flex items-center mt-2 space-x-4">
													<Badge variant="secondary">
														<MapPin className="h-4 w-4 mr-1" />
														{request.radius}m raio
													</Badge>
													<Badge variant="outline">
														<Users className="h-4 w-4 mr-1" />
														{request.respondents}{' '}
														respondentes
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
				</motion.div>
			</div>
		</>
	);
}
