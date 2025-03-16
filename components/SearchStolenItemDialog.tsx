import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { StolenItemsSchemaInterface } from '@/app/lib/schemas/StolenItems';
import { Button } from '@/components/ui/button';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import BACKEND_URL from '@/app/_helpers/backend-path';
import { set } from 'mongoose';

const customIcon = new L.Icon({
	iconUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
});

interface Address {
	postcode?: string;
	road?: string;
	suburb?: string;
	city?: string;
	state?: string;
	country?: string;
}

const fetchAddress = async (
	latitude: number,
	longitude: number
): Promise<Address> => {
	try {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
		);
		const data = await response.json();

		// Retornar os detalhes do endereço
		return {
			postcode: data.address.postcode,
			road: data.address.road,
			suburb: data.address.suburb,
			city: data.address.city,
			state: data.address.state,
			country: data.address.country,
		};
	} catch (error) {
		console.error('Erro ao obter endereço:', error);
		return {};
	}
};

interface SearchStolenItemDialogProps {
	isOpen: boolean;
	onClose: () => void;
	item: StolenItemsSchemaInterface;
}

function CenterMap({ location }: { location: LatLng }) {
	const map = useMap();
	useEffect(() => {
		map.setView(location, 13);
	}, [location, map]);
	return null;
}

const cosineSimilarity = (vec1: number[], vec2: number[]) => {
	const dotProduct = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
	const magnitudeVec1 = Math.sqrt(
		vec1.reduce((acc, val) => acc + val * val, 0)
	);
	const magnitudeVec2 = Math.sqrt(
		vec2.reduce((acc, val) => acc + val * val, 0)
	);

	return dotProduct / (magnitudeVec1 * magnitudeVec2);
};

const getTopSimilarItems = (
	embedding: number[],
	results: any[],
	isTextSearch: boolean
) => {
	const itemsWithSimilarity = results.map((result) => {
		let similarity = 0;
		if (isTextSearch && result.text_embedding) {
			similarity = cosineSimilarity(embedding, result.text_embedding);
		} else if (!isTextSearch && result.img_embedding) {
			similarity = cosineSimilarity(embedding, result.img_embedding);
		}

		if (isTextSearch && !result.text_embedding) {
			similarity = 0;
		} else if (!isTextSearch && !result.img_embedding) {
			similarity = 0;
		}

		return { ...result, similarity };
	});
	return itemsWithSimilarity
		.sort((a, b) => b.similarity - a.similarity)
		.slice(0, 3);
};

export default function SearchStolenItemDialog({
	isOpen,
	onClose,
	item,
}: SearchStolenItemDialogProps) {
	const [address, setAddress] = useState<Address | null>(null);
	const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [isTextSearch, setIsTextSearch] = useState(false);
	const [produtImageEmbeddings, setprodutImageEmbeddings] = useState<
		number[] | null
	>(null);
	const [productTextEmbeddings, setproductTextEmbeddings] = useState<
		number[] | null
	>(null);
	const [title, setTitle] = useState<string>('');

	const [searchResults, setSearchResults] = useState<string[]>([]);
	const [topResults, setTopResults] = useState<any[]>([]);

	const isDefaultImage =
		item.images?.[0]?.imageURL ===
		'https://www.whatnot.co.za/wp-content/uploads/2020/05/block-out-lining-white-1.jpg';

	const itemLocation = item.location?.coordinates
		? new LatLng(item.location.coordinates[1], item.location.coordinates[0])
		: null;

	useEffect(() => {
		if (item.location?.coordinates) {
			const latitude = item.location.coordinates[1];
			const longitude = item.location.coordinates[0];

			// Chamar a função de busca do endereço
			fetchAddress(latitude, longitude).then((address) => {
				setAddress(address);
			});
		}
	}, [item.location]);

	const handleSearch = async () => {
		try {
			const headers = {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
				'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
				Referer: 'https://www.olx.com.br/',
				Connection: 'keep-alive',
				'Content-Type': 'application/json',
			};
			const res = await fetch(BACKEND_URL + '/other/websracp', {
				method: 'POST',
				headers: {
					...headers,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					search_term: title,
				}),
			});

			const data = await res.json();
			console.log('Resposta da API:', data);
			if (data.results) {
				setSearchResults(data.results);
				if (isTextSearch) {
					const topItems = getTopSimilarItems(
						productTextEmbeddings || [],
						data.results,
						true
					);
					setTopResults(topItems);
				} else {
					const topItems = getTopSimilarItems(
						produtImageEmbeddings || [],
						data.results,
						false
					);
					setTopResults(topItems);
				}
			} else {
				setTopResults([]);
				setSearchResults([]);
			}
		} catch (error) {
			console.error('Erro na busca:', error);
		}
	};
	useEffect(() => {
		if (item.images?.[0]?.embeddings) {
			setprodutImageEmbeddings(item.images[0].embeddings);
		}
		if (item.embeddings) {
			setproductTextEmbeddings(item.embeddings);
		}
	}, [item]);

	return (
		<>
			{/* Dialog principal */}
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="p-6 space-y-6">
					<DialogHeader>
						<DialogTitle className="text-xl font-semibold">
							Detalhes do Item
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-4">
						<h2 className="text-lg font-medium">{item.object}</h2>
						<p>{item.objectDescription}</p>
						<p>Status: {item.status}</p>
						<p>
							Localização:{' '}
							{address
								? `${address.road || ''}, ${
										address.suburb || ''
								  }, ${address.city || ''}, ${
										address.state || ''
								  }, ${address.country || ''}${
										address.postcode
											? `, ${address.postcode}`
											: ''
								  }`
								: 'Carregando endereço...'}
						</p>

						{/* Mapa */}
						{itemLocation && (
							<div className="mt-4 h-64 rounded-md overflow-hidden">
								<MapContainer
									center={itemLocation}
									zoom={13}
									scrollWheelZoom={true}
									className="h-full w-full"
								>
									<TileLayer
										url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
										attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									/>
									<Marker
										position={itemLocation}
										icon={customIcon}
									/>
									<CenterMap location={itemLocation} />{' '}
									{/* Centraliza o mapa */}
								</MapContainer>
							</div>
						)}

						<div className="relative mt-4">
							<img
								src={
									item.images?.[0]?.imageURL ||
									'https://www.whatnot.co.za/wp-content/uploads/2020/05/block-out-lining-white-1.jpg'
								}
								alt={item.object}
								className="w-full h-64 object-cover rounded-md mb-4"
							/>
							<div className="flex justify-between items-center w-full">
								{!isDefaultImage &&
									item.images?.[0]?.imageURL && (
										<Button
											onClick={() => {
												setTitle(item.object);
												setImageUrl(
													item.images[0].imageURL
												);
												setprodutImageEmbeddings(
													item.images[0].embeddings
												);

												setIsImageDialogOpen(true);
												handleSearch();
											}}
										>
											Busca Cruzada por Imagem
										</Button>
									)}
								<Button
									onClick={() => {
										setTitle(item.object);
										setproductTextEmbeddings(
											item.embeddings
										);

										setIsImageDialogOpen(true);
										handleSearch();
									}}
									className="ml-auto"
								>
									Busca Cruzada por Texto
								</Button>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog
				open={isImageDialogOpen}
				onOpenChange={() => setIsImageDialogOpen(false)}
			>
				<DialogContent className="p-6">
					<DialogHeader>
						<DialogTitle className="text-xl font-semibold">
							Busca Cruzada na Web
						</DialogTitle>
					</DialogHeader>

					<div className="mt-4">
						{topResults.length > 0 ? (
							<div>
								<h3 className="text-lg font-medium">
									Resultados Mais Semelhantes:
								</h3>
								<ul className="space-y-4 mt-4">
									{topResults.map((result, index) => (
										<li
											key={index}
											className="border-b py-2"
										>
											<div className="flex justify-between items-center">
												<p className="font-semibold">
													{result.title}
												</p>
												<span className="text-sm text-gray-500">
													Score:{' '}
													{result.similarity.toFixed(
														3
													)}
												</span>
											</div>
											<p>{result.location}</p>
											<a
												href={result.product_url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600"
											>
												Ver Item
											</a>
										</li>
									))}
								</ul>
							</div>
						) : (
							<p>Carregando resultados...</p>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
