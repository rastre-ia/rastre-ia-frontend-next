'use client';

import { FunctionComponent, useEffect } from 'react';
import { useState } from 'react';
import {
	MapContainer,
	TileLayer,
	Circle,
	useMap,
	useMapEvents,
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { Search, Send } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { LatLngExpression } from 'leaflet';

function MapEvents({
	onClick,
}: {
	onClick: (latlng: { lat: number; lng: number }) => void;
}) {
	useMapEvents({
		click: (e) => onClick(e.latlng),
	});
	return null;
}

// interface RequestAssistanceProps {}

const RequestAssistance: FunctionComponent = () => {
	const [assistanceMessage, setAssistanceMessage] = useState('');
	const [center, setCenter] = useState<LatLngExpression>([51.505, -0.09]);
	const [radius, setRadius] = useState(1000);

	// Função para obter a localização atual do dispositivo
	const getCurrentLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					setCenter([latitude, longitude]); // Atualiza o centro do estado
				},
				(error) => {
					console.error('Erro ao obter localização: ', error);
					// Defina um centro padrão caso haja erro
					setCenter([51.505, -0.09]);
				}
			);
		} else {
			console.log('Geolocalização não suportada neste navegador.');
		}
	};

	// Função para enviar o pedido de assistência
	const handleSendAssistanceRequest = () => {
		console.log('Sending assistance request:', {
			center,
			radius,
			message: assistanceMessage,
		});
		// Aqui você enviaria esses dados para o backend
		setAssistanceMessage('');
	};

	// Atualizar o centro quando o mapa for clicado
	const handleMapClick = (latlng: { lat: number; lng: number }) => {
		setCenter([latlng.lat, latlng.lng]);
	};

	const MapFlyTo = () => {
		const map = useMap();
		useEffect(() => {
			if (center) {
				map.flyTo(center, 13, {
					duration: 2,
				});
			}
		}, [center]);
		return null;
	};

	useEffect(() => {
		getCurrentLocation();
	}, []);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Pedir assistência à população</CardTitle>
				<CardDescription>
					Selecione uma área no mapa e envie uma mensagem para os
					cidadãos
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="h-[300px]">
					<MapContainer
						center={center}
						zoom={13}
						style={{
							height: '100%',
							width: '100%',
						}}
					>
						<TileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						/>
						<Circle center={center} radius={radius} />
						<MapFlyTo />{' '}
						{/* Componente que vai "voar" até a localização */}
						<MapEvents onClick={handleMapClick} />
					</MapContainer>
				</div>
				<div>
					<Label htmlFor="radius">Raio (metros)</Label>
					<Slider
						id="radius"
						min={10}
						max={10000}
						step={10}
						value={[radius]}
						onValueChange={(value) => setRadius(value[0])}
					/>
				</div>
				<Textarea
					placeholder="Enter message for citizens..."
					value={assistanceMessage}
					onChange={(e) => setAssistanceMessage(e.target.value)}
				/>
				<Button
					onClick={handleSendAssistanceRequest}
					className="w-full"
				>
					<Send className="mr-2 h-4 w-4" />
					Enviar pedido de assistência
				</Button>
				<Button onClick={getCurrentLocation} className="mt-4 w-full">
					<Search className="mr-2 h-4 w-4" />
					Obter localização atual
				</Button>
			</CardContent>
		</Card>
	);
};

export default RequestAssistance;
