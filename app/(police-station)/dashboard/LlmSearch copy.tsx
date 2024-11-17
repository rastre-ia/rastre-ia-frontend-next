'use client'

import { FunctionComponent, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import axios from 'axios';

import BACKEND_URL from "@/app/_helpers/backend-path"

interface LlmSearchProps {}

const LlmSearch: FunctionComponent<LlmSearchProps> = () => {
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [addresses, setAddresses] = useState<string[]>([]);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();

		const searchQuery = (e.target as any).search_query.value;
		const collectionSelector = (e.target as any).collection_selector.value;

		console.log("Searchquery: ", searchQuery, "collections: ", collectionSelector);

		if (!searchQuery) {
			return;
		}

		try {
			const res = await fetch(BACKEND_URL + '/other/vector-search', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					searchQuery: searchQuery,
					collection: collectionSelector,
					numCandidates: 3,
					limit: 3
				}),
			});

			const results = (await res.json()).results;
			console.log(results);

			// Chamar a API de geocodificação reversa para cada resultado
			const fetchAddresses = results.map(async (item: any) => {
				const { lat, long } = item;

				if (lat && long) {
					const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`;

					try {
						const response = await axios.get(apiUrl);
						const addressData = response.data?.address;

						// Extrair os campos específicos do endereço
						const street = addressData?.road || '';
						const neighborhood = addressData?.suburb || addressData?.neighbourhood || '';
						const city = addressData?.city || addressData?.town || '';
						const state = addressData?.state || '';
						const postcode = addressData?.postcode || '';

						// Montar o endereço formatado
						const formattedAddress = `${street}, ${neighborhood}, ${city}, ${state} - ${postcode}`.trim();
						return formattedAddress || 'Endereço não encontrado';
					} catch (error) {
						console.error('Erro ao obter o endereço:', error);
						return 'Erro ao obter endereço';
					}
				}
				return 'Coordenadas inválidas';
			});

			// Espera as respostas das chamadas para geocodificação
			const addresses = await Promise.all(fetchAddresses);
			setSearchResults(results);
			setAddresses(addresses);
		} catch (error) {
			console.error('Erro durante a busca:', error);
		}
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Busca Incrementada por IA</CardTitle>
					<CardDescription>
						Procure por itens, relatórios ou qualquer informação relevante
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSearch}>
						<div className="flex space-x-2">
							<Input
								type="text"
								id="search_query"
								name="search_query"
								placeholder="Digite sua busca"
							/>
							<Select
								defaultValue="stolenitems"
								name="collection_selector"
							>
								<SelectTrigger className="w-[200px]">
									<SelectValue placeholder="Selecione a coleção" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="stolenitems">Itens Roubados</SelectItem>
									<SelectItem value="reports">Reportes</SelectItem>
								</SelectContent>
							</Select>
							<Button type="submit">
								<Search className="h-4 w-4" />
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			<ScrollArea className="h-[400px]">
				<div className="space-y-4">
					{searchResults.map((item, index) => (
						<Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300">
							<CardHeader>
								<CardTitle>{item.object || 'Sem título'}</CardTitle>
								<CardDescription>
									{item.objectDescription || 'Sem descrição'}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="font-semibold text-lg text-gray-800">Score: {item.score?.toFixed(4)}</p>
								<p className="text-sm text-gray-600">Localização: {addresses[index] || 'Desconhecida'}</p>
								<p className="text-sm text-gray-600">Data do evento: {item.eventDate || 'Desconhecida'}</p>
							</CardContent>
							<CardFooter className="flex justify-between items-center">
								<Badge className="bg-blue-500 text-white">Resultado {index + 1}</Badge>
								<Button variant="link" size="sm" className="text-blue-600">Ver mais</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			</ScrollArea>
		</>
	);
};

export default LlmSearch;
