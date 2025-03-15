'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface StolenItem {
	id: number;
	name: string;
	description: string;
	status: 'Ativo' | 'Recuperado' | 'Fechado';
	location: string;
	date: string;
	image: string;
}

// Função simulada para buscar itens roubados
const fetchStolenItems = async (
	page: number
): Promise<{ items: StolenItem[]; totalPages: number }> => {
	await new Promise((resolve) => setTimeout(resolve, 500));
	return {
		items: Array(12)
			.fill(null)
			.map((_, i) => ({
				id: i + 1 + (page - 1) * 10,
				name: `Item ${i + 1 + (page - 1) * 10}`,
				description: `Descrição do Item ${i + 1 + (page - 1) * 10}`,
				status: ['Ativo', 'Recuperado', 'Fechado'][
					Math.floor(Math.random() * 3)
				] as StolenItem['status'],
				location: `Cidade ${Math.floor(Math.random() * 10) + 1}`,
				date: new Date(
					Date.now() - Math.floor(Math.random() * 10000000000)
				).toLocaleDateString('pt-BR'),
				image: `/placeholder.svg?height=100&width=100`,
			})),
		totalPages: 10,
	};
};

export default function SearchStolenItems() {
	const [items, setItems] = useState<StolenItem[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [filter, setFilter] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		loadItems();
	}, [currentPage, filter]);

	const loadItems = async () => {
		setIsLoading(true);
		const { items, totalPages } = await fetchStolenItems(currentPage);
		setItems(items);
		setTotalPages(totalPages);
		setIsLoading(false);
	};

	const handleSearch = () => {
		setCurrentPage(1);
		loadItems();
	};

	const handleFilterChange = (value: string) => {
		setFilter(value);
		setCurrentPage(1);
	};

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Card>
					<CardHeader>
						<CardTitle>
							Pesquisar e Filtrar Itens Roubados
						</CardTitle>
						<CardDescription>
							Use as opções abaixo para encontrar itens
							específicos
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex space-x-2">
							<Input
								type="text"
								placeholder="Buscar itens..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="flex-grow"
							/>
							<Button onClick={handleSearch} disabled={isLoading}>
								<Search className="h-4 w-4 mr-2" />
								Buscar
							</Button>
						</div>
						<Select
							value={filter}
							onValueChange={handleFilterChange}
						>
							<SelectTrigger>
								<SelectValue placeholder="Filtrar por status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">
									Todos os Itens
								</SelectItem>
								<SelectItem value="active">Ativo</SelectItem>
								<SelectItem value="recovered">
									Recuperado
								</SelectItem>
								<SelectItem value="closed">Fechado</SelectItem>
							</SelectContent>
						</Select>
					</CardContent>
				</Card>
			</motion.div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
			>
				{items.map((item) => (
					<Card key={item.id}>
						<CardHeader>
							<CardTitle>{item.name}</CardTitle>
							<CardDescription>
								Reportado em {item.date}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<img
								src={item.image}
								alt={item.name}
								className="w-full h-32 object-cover mb-4 rounded-md"
							/>
							<p>{item.description}</p>
							<div className="flex items-center mt-2 space-x-2">
								<Badge
									variant={
										item.status === 'Ativo'
											? 'default'
											: item.status === 'Recuperado'
											? 'secondary'
											: 'outline'
									}
								>
									{item.status}
								</Badge>
								<Badge variant="outline">
									<MapPin className="h-4 w-4 mr-1" />
									{item.location}
								</Badge>
							</div>
						</CardContent>
						<CardFooter>
							<Button variant="outline" className="w-full">
								Ver Detalhes
							</Button>
						</CardFooter>
					</Card>
				))}
			</motion.div>

			<Pagination>
				<Button
					variant="outline"
					size="sm"
					onClick={() =>
						setCurrentPage((prev) => Math.max(prev - 1, 1))
					}
					disabled={currentPage === 1}
				>
					<ChevronLeft className="h-4 w-4 mr-2" />
					Anterior
				</Button>
				<div className="mx-4">
					Página {currentPage} / {totalPages}
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() =>
						setCurrentPage((prev) => Math.min(prev + 1, totalPages))
					}
					disabled={currentPage === totalPages}
				>
					Próximo
					<ChevronRight className="h-4 w-4 ml-2" />
				</Button>
			</Pagination>
		</>
	);
}
