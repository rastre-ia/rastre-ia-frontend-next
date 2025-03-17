'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { getStolenItems } from '@/app/_helpers/db/stolen-items';
import {
	StolenItemsStatusEnum,
	StolenItemsSchemaInterface,
} from '@/app/lib/schemas/StolenItems';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLng, latLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { set } from 'mongoose';

const statusTranslationMap = {
	[StolenItemsStatusEnum.PENDING]: 'Pendente',
	[StolenItemsStatusEnum.ON_INVESTIGATION]: 'Em Investigação',
	[StolenItemsStatusEnum.SOLVED_NOT_RECUPERATED]:
		'Resolvido - Não Recuperado',
	[StolenItemsStatusEnum.SOLVED_RECUPERATED]: 'Resolvido - Recuperado',
	[StolenItemsStatusEnum.NOT_SOLVED]: 'Não Resolvido',
};

const customIcon = new L.Icon({
	iconUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
});

function CenterMap({ location }: { location: LatLng }) {
	const map = useMap();
	useEffect(() => {
		map.setView(location, 13);
	}, [location, map]);
	return null;
}

export default function PanoramaStolenItem() {
	const [statusFilter, setStatusFilter] = useState<string | null>('all');

	const [stolenItems, setStolenItems] = useState<
		StolenItemsSchemaInterface[]
	>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedItem, setSelectedItem] =
		useState<StolenItemsSchemaInterface | null>(null);
	const [userLocation, setUserLocation] = useState<LatLng>(
		latLng(-24.724443, -53.740623)
	);

	const loadItems = async () => {
		setIsLoading(true);
		try {
			const result = await getStolenItems();
			let filteredItems = [...result.stolenItems];
			if (statusFilter && statusFilter !== 'all') {
				filteredItems = filteredItems.filter(
					(item) => item.status === statusFilter
				);
			}
			setStolenItems(filteredItems || []);
		} catch (error) {
			console.error('Erro ao carregar itens:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadItems();
	}, []);

	useEffect(() => {
		if (statusFilter !== null) {
			loadItems();
		}
	}, [statusFilter]);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					setUserLocation(new LatLng(latitude, longitude));
				},
				(error) => {
					console.error('Erro ao obter localização: ', error);
				}
			);
		} else {
			console.log('Geolocalização não é suportada pelo navegador');
		}
	}, []);

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
						<Select
							value={statusFilter || 'all'}
							onValueChange={(value) => setStatusFilter(value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Filtrar por status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">
									Todos os Itens
								</SelectItem>
								<SelectItem
									value={StolenItemsStatusEnum.PENDING}
								>
									Pendente
								</SelectItem>
								<SelectItem
									value={
										StolenItemsStatusEnum.ON_INVESTIGATION
									}
								>
									Em Investigação
								</SelectItem>
								<SelectItem
									value={
										StolenItemsStatusEnum.SOLVED_NOT_RECUPERATED
									}
								>
									Resolvido - Não Recuperado
								</SelectItem>
								<SelectItem
									value={
										StolenItemsStatusEnum.SOLVED_RECUPERATED
									}
								>
									Resolvido - Recuperado
								</SelectItem>
								<SelectItem
									value={StolenItemsStatusEnum.NOT_SOLVED}
								>
									Não Resolvido
								</SelectItem>
							</SelectContent>
						</Select>
					</CardContent>
				</Card>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Card>
					<CardHeader>
						<CardTitle>Mapa de Itens Roubados</CardTitle>
						<CardDescription>
							Visualização geográfica dos itens registrados
						</CardDescription>
					</CardHeader>
					<CardContent className="h-[500px]">
						{stolenItems.length > 0 ? (
							<MapContainer
								key={selectedItem?._id?.toString()}
								center={
									userLocation
										? [userLocation.lat, userLocation.lng]
										: [-23.5505, -46.6333]
								}
								zoom={userLocation ? 13 : 10}
								style={{ height: '100%', width: '100%' }}
							>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								/>
								{stolenItems.map((item) =>
									item.location.coordinates[1] &&
									item.location.coordinates[0] ? (
										<Marker
											key={item._id?.toString()}
											position={[
												item.location.coordinates[1],
												item.location.coordinates[0],
											]}
											icon={customIcon}
											eventHandlers={{
												click: () => {
													setSelectedItem(item);
												},
											}}
										>
											<Popup closeButton={false}>
												<div
													style={{
														textAlign: 'left',
													}}
												>
													<h3>
														<span className="font-bold">
															Item roubado:{' '}
														</span>
														{item.object}
													</h3>
													<h3>
														<span className="font-bold">
															Relato feito em:{' '}
														</span>
														{item.createdAt
															? new Date(
																	item.createdAt
															  ).toLocaleDateString(
																	'pt-BR'
															  )
															: ''}
													</h3>
													<h3>
														<span className="font-bold">
															Status:{' '}
														</span>
														{(item.status &&
															statusTranslationMap[
																item.status as StolenItemsStatusEnum
															]) ||
															item.status}
													</h3>
													<img
														src={
															item.images?.[0]
																?.imageURL
														}
														alt={item.object}
														style={{
															width: '100%',
															maxHeight: '200px',
															maxWidth: '200px',
														}}
													/>
												</div>
											</Popup>
										</Marker>
									) : null
								)}
								{selectedItem?.location.coordinates[1] &&
									selectedItem?.location.coordinates[0] && (
										<CenterMap
											location={
												new LatLng(
													selectedItem.location.coordinates[1],
													selectedItem.location.coordinates[0]
												)
											}
										/>
									)}
							</MapContainer>
						) : (
							<div className="flex h-full items-center justify-center">
								<MapContainer
									center={[-23.5505, -46.6333]}
									zoom={10}
									style={{
										height: '100%',
										width: '100%',
									}}
								>
									<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
								</MapContainer>
							</div>
						)}
					</CardContent>
				</Card>
			</motion.div>
		</>
	);
}
