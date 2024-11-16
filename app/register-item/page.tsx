'use client';

import { useState, useEffect, FormEvent } from 'react';
import {
	MapContainer,
	TileLayer,
	Marker,
	useMapEvents,
	Popup,
} from 'react-leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
	Upload,
	ArrowLeft,
	Camera,
	MapPin,
	FileText,
	User,
	Calendar,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AnimatedLogo from '@/components/AnimatedLogo';
import Link from 'next/link';

import { CldUploadWidget } from 'next-cloudinary';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { StolenItemsSchemaInterface } from '../lib/schemas/StolenItems';
import { EmbeddedImageSchemaInterface } from '../lib/schemas/helpers/EmbeddedImageSchema';
import { registerNewStolenItem } from '../_helpers/db/stolen-items';

interface LatLng {
	lat: number;
	lng: number;
}

interface LocationMarkerProps {
	position: LatLng | null;
	setPosition: (position: LatLng) => void;
}
const customIcon = new L.Icon({
	iconUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
});

function LocationMarker({ position, setPosition }: LocationMarkerProps) {
	const [address, setAddress] = useState<string | null>(null);

	const map = useMapEvents({
		locationfound(e) {
			// Quando a localização for encontrada, define a posição do marcador
			setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
			map.flyTo(e.latlng, map.getZoom());
		},
	});

	useEffect(() => {
		map.locate({ setView: true, maxZoom: 16 });
	}, [map]);

	const handleDrag = (event: any) => {
		const { lat, lng } = event.target.getLatLng();
		setPosition({ lat, lng });
	};

	// Função para buscar o endereço com base na latitude e longitude
	const fetchAddress = async (lat: number, lng: number) => {
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
			);
			const data = await response.json();

			const addressComponents = [
				data.address.road, // Nome da rua
				data.address.neighbourhood, // Bairro
				data.address.city, // Cidade
				data.address.state, // Estado
				data.address.postcode, // CEP
			];

			// Filtra valores vazios e monta o endereço
			const filteredAddress = addressComponents
				.filter(Boolean)
				.join(', ');

			setAddress(filteredAddress);
		} catch (error) {
			console.error('Erro ao buscar endereço:', error);
			setAddress('Endereço não encontrado');
		}
	};

	// Sempre que a posição mudar, atualizamos o endereço
	useEffect(() => {
		if (position) {
			fetchAddress(position.lat, position.lng);
		}
	}, [position]);

	return position === null ? null : (
		<Marker
			position={position}
			icon={customIcon}
			draggable={true}
			eventHandlers={{
				dragend: handleDrag, // Quando o marcador for arrastado e o arraste terminar, atualiza a posição
			}}
		>
			<Popup>
				<p>Latitude: {position.lat}</p>
				<p>Longitude: {position.lng}</p>
				<p>Endereço: {address ? address : 'Carregando...'}</p>
			</Popup>
		</Marker>
	);
}

export default function RegisterItem() {
	const [position, setPosition] = useState<LatLng | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const { data: session, status } = useSession();
	const { toast } = useToast();
	const userId = session?.user?._id;
	const router = useRouter();

	if (status === 'unauthenticated') {
		redirect('/login?redirect_to=/register-item');
	}
	if (!userId) {
		return <div>Loading...</div>;
	}
	const center: LatLng = { lat: -23.564, lng: -46.652 };

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		const longitude = position?.lng;
		const latitude = position?.lat;

		if (!longitude || !latitude) {
			toast({
				title: 'Error',
				description: 'Por favor, selecione a localização do incidente',
				variant: 'destructive',
			});
			return;
		}

		const images: EmbeddedImageSchemaInterface[] = imageUrl
			? [
					{
						imageURL: imageUrl,
						embeddings: [],
					},
			  ]
			: [];

		try {
			// const userObjectId = await getUserObjectIdById(userId);

			const stolenItemBody: StolenItemsSchemaInterface = {
				userId: userId,
				object: (e.target as HTMLFormElement).object.value,
				eventDate: (e.target as HTMLFormElement)['event-date'].value,
				images: images,
				objectDescription: (e.target as HTMLFormElement)
					.objectDescription.value,
				eventDescription: (e.target as HTMLFormElement).eventDescription
					.value,
				suspectCharacteristics: (e.target as HTMLFormElement)
					.suspectCharacteristics.value,

				location: {
					type: 'Point',
					coordinates: [longitude, latitude],
				},

				embeddings: [],
			};

			const res = await registerNewStolenItem(stolenItemBody);
			if (res.status === 200) {
				console.log('Report created successfully');
				toast({
					title: 'Success',
					description: 'Seu relatório foi criado com sucesso',
					variant: 'default',
				});
				router.push('/my-profile');
			} else {
				throw new Error('Error creating report');
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Erro ao criar relatório',
				variant: 'destructive',
			});
			console.error('Error creating report:', error);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-3xl mx-auto"
			>
				<div className="flex justify-between items-center mb-6">
					<Link href="/my-profile">
						<Button variant="ghost" className="gap-2">
							<ArrowLeft className="h-4 w-4" />
							Voltar à minha página
						</Button>
					</Link>
					<AnimatedLogo className="text-3xl font-bold text-primary" />
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">
							Registrar Item Roubado
						</CardTitle>
						<CardDescription>
							Forneça detalhes sobre o item roubado para ajudar na
							recuperação
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<Label
								htmlFor="object"
								className="flex items-center gap-2 mb-2"
							>
								<FileText className="h-4 w-4" />
								Qual é o objeto?
							</Label>
							<Input
								id="object"
								placeholder="ex: iPhone 12, Relógio Rolex"
							/>
							<Label
								htmlFor="event-date"
								className="flex items-center gap-2 mb-2"
							>
								<Calendar className="h-4 w-4" /> Data do roubo
							</Label>
							<Input id="event-date" type="datetime-local" />
							<Label className="flex items-center gap-2 mb-2">
								<Camera className="h-4 w-4" />
								Foto do objeto
							</Label>
							<CldUploadWidget
								uploadPreset="ml_default"
								onSuccess={(result, { widget }) => {
									// @ts-ignore
									setImageUrl(result.info?.secure_url);
								}}
								onQueuesEnd={(result, { widget }) => {
									widget.close();
								}}
							>
								{({ open }) => (
									<Button
										type="button"
										onClick={() => open()}
									>
										<Camera className="h-4 w-4 mr-2" />
										Upload da Foto
									</Button>
								)}
							</CldUploadWidget>

							{/* Renderização da imagem após o upload */}
							{imageUrl && (
								<img
									src={imageUrl}
									alt="Imagem do objeto"
									className="mt-4 w-full h-auto"
								/>
							)}

							<Label
								htmlFor="objectDescription"
								className="flex items-center gap-2 mb-2"
							>
								<FileText className="h-4 w-4" />
								Descrição do objeto
							</Label>
							<Textarea
								id="objectDescription"
								placeholder="Forneça uma descrição detalhada do item"
							/>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: 0.5 }}
							>
								<Label className="flex items-center gap-2 mb-2">
									<MapPin className="h-4 w-4" />
									Local do incidente
								</Label>
								<div className="h-[300px] mt-2 rounded-md overflow-hidden">
									<MapContainer
										center={center}
										zoom={9}
										style={{
											height: '100%',
											width: '100%',
										}}
									>
										<TileLayer
											url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
											attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
										/>
										<LocationMarker
											position={position}
											setPosition={setPosition}
										/>
									</MapContainer>
								</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: 0.6 }}
							>
								<Label
									htmlFor="eventDescription"
									className="flex items-center gap-2 mb-2"
								>
									<FileText className="h-4 w-4" />
									Descrição do evento
								</Label>
								<Textarea
									id="eventDescription"
									placeholder="Descreva como ocorreu o roubo"
								/>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: 0.7 }}
							>
								<Label
									htmlFor="suspectCharacteristics"
									className="flex items-center gap-2 mb-2"
								>
									<User className="h-4 w-4" />
									Características do ladrão
								</Label>
								<Textarea
									id="suspectCharacteristics"
									placeholder="Descreva quaisquer características notáveis do ladrão"
								/>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.8 }}
							>
								<Button type="submit" className="w-full">
									<Upload className="mr-2 h-4 w-4" />{' '}
									Registrar Item Roubado
								</Button>
							</motion.div>
						</form>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
