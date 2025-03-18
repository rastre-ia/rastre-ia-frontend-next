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

import { getStolenItems } from '@/app/_helpers/db/stolen-items';
import {
	StolenItemsSchemaInterface,
	StolenItemsStatusEnum,
} from '@/app/lib/schemas/StolenItems';

import SearchStolenItemDialog from '@/components/SearchStolenItemDialog';
import { useToast } from '@/hooks/use-toast';

interface Address {
	city?: string;
	state?: string;
	error?: boolean;
}
type AddressState = {
	address?: Address;
	loading: boolean;
	error?: boolean;
};

type CoordinateKey = `${number},${number}`;

const fetchAddress = async (
	latitude: number,
	longitude: number
): Promise<Address> => {
	try {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
		);
		const data = await response.json();

		return {
			city: data.address.city,
			state: data.address.state,
		};
	} catch (error) {
		throw error;
	}
};

export default function SearchStolenItems() {
	const [items, setItems] = useState<StolenItemsSchemaInterface[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [filter, setFilter] = useState<StolenItemsStatusEnum | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [perPage] = useState(12);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedItem, setSelectedItem] =
		useState<StolenItemsSchemaInterface | null>(null);
	const [addresses, setAddresses] = useState<
		Record<CoordinateKey, AddressState>
	>({});
	useEffect(() => {
		loadItems();
	}, [currentPage, filter]);
	const { toast } = useToast();
	const loadItems = async () => {
		setIsLoading(true);

		try {
			const response = await getStolenItems(perPage, currentPage, filter);
			setItems(response.stolenItems);
			setTotalPages(response.pageCount);

			const addressUpdates: Record<CoordinateKey, AddressState> = {};

			response.stolenItems.forEach((item) => {
				const coords = item.location?.coordinates;
				if (coords && coords.length >= 2) {
					const [longitude, latitude] = coords;
					const key: CoordinateKey = `${latitude},${longitude}`;
					addressUpdates[key] = { loading: true };
				}
			});
			setAddresses((prev) => ({ ...prev, ...addressUpdates }));

			await Promise.all(
				response.stolenItems.map(async (item) => {
					const coords = item.location?.coordinates;
					if (!coords || coords.length < 2) return;

					const [longitude, latitude] = coords;
					const key: CoordinateKey = `${latitude},${longitude}`;
					let finalAddress: Address = {};

					for (let attempt = 1; attempt <= 3; attempt++) {
						try {
							await new Promise((resolve) =>
								setTimeout(resolve, 1000 * attempt)
							);
							const address = await fetchAddress(
								latitude,
								longitude
							);
							finalAddress = address;
							break;
						} catch (error) {
							if (attempt === 3) {
								toast({
									title: 'Erro',
									description: `Falha após 3 tentativas para ${key}`,
									variant: 'destructive',
								});

								console.error(
									`Falha após 3 tentativas para ${key}: ${error}`
								);
								finalAddress = { error: true };
							}
						}
					}

					setAddresses((prev) => ({
						...prev,
						[key]: {
							address: finalAddress,
							loading: false,
							error: finalAddress.error,
						},
					}));
				})
			);
		} catch (error) {
			console.error('Erro ao carregar itens:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = () => {
		setCurrentPage(1);
		loadItems();
	};

	const handleFilterChange = (value: string) => {
		if (value === 'all') {
			setFilter(null);
		} else {
			setFilter(value as StolenItemsStatusEnum);
		}
		setCurrentPage(1);
	};
	const openDialog = (item: StolenItemsSchemaInterface) => {
		setSelectedItem(item);
		setIsDialogOpen(true);
	};

	const closeDialog = () => {
		setIsDialogOpen(false);
		setSelectedItem(null);
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
							value={filter?.toString() || 'todos'}
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
					<Card key={item._id?.toString()}>
						<CardHeader>
							<CardTitle>{item.object}</CardTitle>
							<CardDescription>
								Reportado em{' '}
								{item.createdAt
									? new Date(
											item.createdAt
									  ).toLocaleDateString()
									: ''}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<img
								src={
									item.images?.[0]?.imageURL ||
									'https://www.whatnot.co.za/wp-content/uploads/2020/05/block-out-lining-white-1.jpg'
								}
								className="w-full h-32 object-cover mb-4 rounded-md"
							/>
							<p>{item.objectDescription}</p>
							<div className="flex items-center mt-2 space-x-2">
								<Badge
									variant={
										item.status ===
										StolenItemsStatusEnum.PENDING
											? 'default'
											: item.status ===
											  StolenItemsStatusEnum.SOLVED_NOT_RECUPERATED
											? 'destructive'
											: item.status ===
											  StolenItemsStatusEnum.SOLVED_RECUPERATED
											? 'secondary'
											: 'outline'
									}
								>
									{item.status}
								</Badge>
								<Badge variant="outline">
									<MapPin className="h-4 w-4 mr-1" />
									{item.location?.coordinates
										? (() => {
												const key =
													`${item.location.coordinates[1]},${item.location.coordinates[0]}` as CoordinateKey;
												const addressState =
													addresses[key];

												if (!addressState)
													return 'Carregando...';

												return addressState.loading ? (
													<span className="animate-pulse">
														Buscando localização...
													</span>
												) : addressState.error ? (
													'Localização não disponível'
												) : (
													<>
														{addressState.address
															?.city ||
															'Cidade não identificada'}
														,
														{addressState.address
															?.state ||
															'Estado não identificado'}
													</>
												);
										  })()
										: 'Sem coordenadas'}
								</Badge>
							</div>
						</CardContent>
						<CardFooter>
							<Button
								variant="outline"
								className="w-full"
								onClick={() => openDialog(item)}
							>
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

			{isDialogOpen && selectedItem && (
				<SearchStolenItemDialog
					isOpen={isDialogOpen}
					onClose={closeDialog}
					item={selectedItem}
				/>
			)}
		</>
	);
}
