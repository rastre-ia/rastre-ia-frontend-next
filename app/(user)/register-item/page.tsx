'use client';

import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
	ArrowLeft,
	Calendar,
	Camera,
	FileText,
	MapPin,
	Upload,
	User,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import AnimatedLogo from '@/components/AnimatedLogo';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { CldUploadWidget } from 'next-cloudinary';
import { redirect, useRouter } from 'next/navigation';
import { registerNewStolenItem } from '../../_helpers/db/stolen-items';
import { StolenItemsSchemaInterface } from '../../lib/schemas/StolenItems';
import { EmbeddedImageSchemaInterface } from '../../lib/schemas/helpers/EmbeddedImageSchema';

interface LatLng {
	lat: number;
	lng: number;
}

interface LocationMarkerProps {
	position: LatLng | null;
}

const customIcon = new L.Icon({
	iconUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
});

function LocationMarker({ position }: LocationMarkerProps) {
	return position === null ? null : (
		<Marker position={position} icon={customIcon} />
	);
}

export default function RegisterItem() {
	const [position] = useState<LatLng | null>(null);
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
								Qual é o objeto?*
							</Label>
							<Input
								id="object"
								placeholder="ex: iPhone 12, Relógio Rolex"
								required
							/>
							<Label
								htmlFor="event-date"
								className="flex items-center gap-2 mb-2"
							>
								<Calendar className="h-4 w-4" /> Data do roubo*
							</Label>
							<Input id="event-date" type="datetime-local" />
							<Label className="flex items-center gap-2 mb-2">
								<Camera className="h-4 w-4" />
								Foto do objeto
							</Label>
							<CldUploadWidget
								uploadPreset="ml_default"
								onSuccess={(result) => {
									//@ts-expect-error - result.info is not null
									setImageUrl(result.info?.secure_url);
								}}
								onQueuesEnd={(_, { widget }) => {
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
								Descrição do objeto*
							</Label>
							<Textarea
								id="objectDescription"
								placeholder="Forneça uma descrição detalhada do item"
								required
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
										zoom={10}
										minZoom={10}
										scrollWheelZoom={true}
										style={{
											height: '100%',
											width: '100%',
											maxWidth: '500px',
										}}
									>
										<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
										<LocationMarker position={position} />
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
									Descrição do evento*
								</Label>
								<Textarea
									id="eventDescription"
									placeholder="Descreva como ocorreu o roubo"
									required
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
									Características do ladrão*
								</Label>
								<Textarea
									id="suspectCharacteristics"
									placeholder="Descreva quaisquer características notáveis do ladrão"
									required
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
