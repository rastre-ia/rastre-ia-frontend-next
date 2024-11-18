'use client';

import { FunctionComponent, useState } from 'react';
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
import BACKEND_URL from '@/app/_helpers/backend-path';

interface LlmSearchProps {}

const LlmSearch: FunctionComponent<LlmSearchProps> = ({}) => {
	const [response, setResponse] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setResponse(null);

		const searchQuery = (e.target as any).search_query.value;

		if (!searchQuery) {
			setError('Por favor, insira uma consulta.');
			setLoading(false);
			return;
		}

		try {
			const res = await fetch(BACKEND_URL + '/other/llama-search', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: searchQuery,
				}),
			});

			if (!res.ok) {
				throw new Error(`Erro na requisição: ${res.status}`);
			}

			const data = (await res.json()).results;
			console.log(data);
			setResponse(data);
		} catch (err) {
			console.error('Erro durante a busca:', err);
			setError('Ocorreu um erro ao processar a sua solicitação.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Busca com IA</CardTitle>
					<CardDescription>
						Consulte informações utilizando IA.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSearch}>
						<div className="flex space-x-2">
							<Input
								type="text"
								id="search_query"
								name="search_query"
								placeholder="Digite sua consulta"
							/>
							<Button type="submit" disabled={loading}>
								{loading ? (
									'Buscando...'
								) : (
									<Search className="h-4 w-4" />
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			<ScrollArea className="h-[400px] mt-4">
				{error && (
					<div className="text-red-600 font-semibold">{error}</div>
				)}
				{response ? (
					<Card className=" hover:shadow-xl transition-all duration-300">
						<CardHeader>
							<CardTitle>Resultado</CardTitle>
						</CardHeader>
						<CardContent>
							<p
								dangerouslySetInnerHTML={{
									__html: response.replace(/\n/g, '<br>'),
								}}
							/>{' '}
						</CardContent>
						<CardFooter>
							<Badge className="bg-green-500 text-white">
								IA
							</Badge>
						</CardFooter>
					</Card>
				) : null}
			</ScrollArea>
		</>
	);
};

export default LlmSearch;
