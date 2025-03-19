'use client';

import { getMarkdown } from '@/app/lib/embeddings-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import L, { LatLng, latLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSession } from 'next-auth/react';
import { FormEvent, useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { registerNewStolenItem } from '../../_helpers/db/stolen-items';
import { StolenItemsSchemaInterface } from '../../lib/schemas/StolenItems';

const embeddings_url = process.env.NEXT_PUBLIC_EMBEDDING_ENDPOINT_URL || '';
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
console.log('url:', embeddings_url);

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

async function geocodeAddress(address: string) {
	try {
		const response = await axios.get(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
				address
			)}&key=${GOOGLE_MAPS_API_KEY}`
		);

		if (response.data.status === 'OK') {
			const location = response.data.results[0].geometry.location;
			return { lat: location.lat, lng: location.lng };
		} else {
			throw new Error('Não foi possível obter coordenadas.');
		}
	} catch (error) {
		console.error('Erro ao geocodificar endereço:', error);
		throw new Error('Erro ao geocodificar endereço');
	}
}

export default function Migrate() {
	const [file, setFile] = useState<File | null>(null);
	const [response, setResponse] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [position, setPosition] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const { data: session, status } = useSession();
	const userId = session?.user?._id;
	const { toast } = useToast();

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0] || null;
		setFile(selectedFile);
	};

	const handleUpload = async () => {
		if (!file) {
			toast({
				title: 'Erro',
				description: 'Por favor, selecione um arquivo antes de enviar.',
				variant: 'destructive',
			});
			return;
		}

		try {
			const result = await getMarkdown(embeddings_url, file);
			console.log(result.location);

			if (result && result.location) {
				const coordinates = await geocodeAddress(result.location);
				setPosition(coordinates);
				result.location = {
					type: 'Point',
					coordinates: [coordinates.lng, coordinates.lat],
				};
			}

			setResponse(result);
		} catch (error) {
			toast({
				title: 'Erro ao processar o arquivo',
				description:
					error instanceof Error
						? error.message
						: 'Erro desconhecido',
				variant: 'destructive',
			});
			setResponse(null);
		} finally {
			setLoading(false);
		}
	};
	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		// Verificar se a localização foi obtida antes de enviar
		const longitude = position?.lng;
		const latitude = position?.lat;

		if (!longitude || !latitude) {
			toast({
				title: 'Error',
				description: 'Localização inválida',
				variant: 'destructive',
			});
			return;
		}

		if (!userId) {
			toast({
				title: 'Error',
				description: 'Usuário não autenticado',
				variant: 'destructive',
			});
			return;
		}

		const stolenItemBody: StolenItemsSchemaInterface = {
			userId: userId,
			object: response?.object,
			eventDate: response?.eventDate,
			images: [],
			objectDescription: response?.objectDescription,
			eventDescription: response?.eventDescription,
			suspectCharacteristics: response?.suspectCharacteristics,
			location: {
				type: 'Point',
				coordinates: [longitude, latitude],
			},
			embeddings: [],
		};

		try {
			const res = await registerNewStolenItem(stolenItemBody);
			if (res.status === 200) {
				console.log('Report created successfully');
				toast({
					title: 'Success',
					description: 'Seu relatório foi criado com sucesso',
					variant: 'default',
				});
			} else {
				toast({
					title: 'Erro ao criar relatório',
					description: 'Houve um erro ao criar o relatório.',
					variant: 'destructive',
				});
			}
		} catch (error) {
			console.error('Erro ao enviar dados:', error);
			toast({
				title: 'Erro ao processar os dados',
				description:
					error instanceof Error
						? error.message
						: 'Erro desconhecido',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen space-y-6 p-4">
			<Card className="w-full max-w-lg">
				<CardHeader>
					<CardTitle>Upload de Arquivo</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<input
						type="file"
						onChange={handleFileChange}
						className="border p-2 w-full"
					/>
					<Button onClick={handleUpload} disabled={loading}>
						{loading ? 'Processando...' : 'Enviar Arquivo'}
					</Button>
				</CardContent>
			</Card>

			{response && (
				<Card className="w-full max-w-lg">
					<CardHeader>
						<CardTitle>Resposta JSON</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto">
							{JSON.stringify(response, null, 2)}
						</pre>
					</CardContent>
				</Card>
			)}

			{response && response.location && (
				<Card className="w-full max-w-lg">
					<CardHeader>
						<CardTitle>Localização</CardTitle>
					</CardHeader>
					<CardContent>
						<MapContainer
							center={latLng(
								response.location.coordinates[1],
								response.location.coordinates[0]
							)}
							zoom={13}
							style={{ height: '400px', width: '100%' }}
						>
							<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
							<Marker
								position={latLng(
									response.location.coordinates[1],
									response.location.coordinates[0]
								)}
								icon={customIcon}
							/>
							<CenterMap
								location={latLng(
									response.location.coordinates[1],
									response.location.coordinates[0]
								)}
							/>
						</MapContainer>
						<Button onClick={handleSubmit}>Migrar Item</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
