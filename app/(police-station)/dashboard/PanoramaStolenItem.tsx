'use client';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { getStolenItems } from '@/app/_helpers/db/stolen-items';
import {
	StolenItemsSchemaInterface,
	StolenItemsStatusEnum,
} from '@/app/lib/schemas/StolenItems';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import L, { LatLng, latLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

const statusTranslationMap = {
	[StolenItemsStatusEnum.PENDING]: 'Pendente',
	[StolenItemsStatusEnum.ON_INVESTIGATION]: 'Em Investigação',
	[StolenItemsStatusEnum.SOLVED_NOT_RECUPERATED]:
		'Resolvido - Não Recuperado',
	[StolenItemsStatusEnum.SOLVED_RECUPERATED]: 'Resolvido - Recuperado',
};

function CenterMap({ location }: { location: LatLng }) {
	const map = useMap();
	useEffect(() => {
		map.setView(location, 13);
	}, [location, map]);
	return null;
}

const PUBLIC_URL = process.env.NEXT_PUBLIC_URL || '';
const iconUrls = {
	[StolenItemsStatusEnum.PENDING]: `${PUBLIC_URL}/resources/marker-icon-blue.png`,
	[StolenItemsStatusEnum.ON_INVESTIGATION]: `${PUBLIC_URL}/resources/marker-icon-yellow.png`,
	[StolenItemsStatusEnum.SOLVED_NOT_RECUPERATED]: `${PUBLIC_URL}/resources/marker-icon-red.png`,
	[StolenItemsStatusEnum.SOLVED_RECUPERATED]: `${PUBLIC_URL}/resources/marker-icon-green.png`,
};
export default function PanoramaStolenItem() {
	const [statusFilter, setStatusFilter] = useState<string | null>('all');

	const [stolenItems, setStolenItems] = useState<
		StolenItemsSchemaInterface[]
	>([]);
	const [selectedItem, setSelectedItem] =
		useState<StolenItemsSchemaInterface | null>(null);
	const [userLocation, setUserLocation] = useState<LatLng>(
		latLng(-24.724443, -53.740623)
	);

	const loadItems = async () => {
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
					<div className="flex w-full justify-between flex-wrap">
						<CardHeader className="pb-4">
							<CardTitle>Mapa de Itens Roubados</CardTitle>
							<CardDescription>
								Visualização geográfica dos itens registrados
							</CardDescription>
						</CardHeader>
						<div className="flex align-middle px-6">
							<div className="my-auto mb-6">
								<Select
									value={statusFilter || 'all'}
									onValueChange={(value) =>
										setStatusFilter(value)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Filtrar por status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											Todos os Itens
										</SelectItem>
										<SelectItem
											value={
												StolenItemsStatusEnum.PENDING
											}
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
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
					<CardContent className="h-[500px]">
						{stolenItems.length > 0 ? (
							<MapContainer
								key={selectedItem?._id?.toString()}
								center={
									userLocation
										? [userLocation.lat, userLocation.lng]
										: [-15.7913, -47.8904]
								}
								zoom={userLocation ? 10 : 4}
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
											icon={
												new L.Icon({
													iconUrl:
														iconUrls[
															item.status as StolenItemsStatusEnum
														] ||
														iconUrls[
															StolenItemsStatusEnum
																.PENDING
														],
													iconSize: [25, 41],
													iconAnchor: [12, 41],
													popupAnchor: [1, -34],
												})
											}
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
