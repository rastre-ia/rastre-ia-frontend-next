'use client';

import { useEffect, useState } from 'react';
import { Upload, Camera } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	ReportAssistanceNeededEnum,
	ReportSchemaInterface,
	ReportStatusEnum,
	ReportSubmissionMethodEnum,
	ReportTypeEnum,
} from '../../lib/schemas/Reports';
import { validReportTypesTranslated } from '../../_helpers/report-type-translator';
import { getUserObjectIdById } from '../../_helpers/db/users';
import { createNewReport } from '../../_helpers/db/reports';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { FunctionComponent } from 'react';
import L, { LatLng, latLng } from 'leaflet';
import { CldUploadWidget } from 'next-cloudinary';
import { RotatingLines } from 'react-loader-spinner';

function LocationPicker({
	onLocationChange,
}: {
	onLocationChange: (latlng: { lat: number; lng: number }) => void;
}) {
	const [position, setPosition] = useState({ lat: 51.505, lng: -0.09 });

	const map = useMapEvents({
		click(e) {
			setPosition(e.latlng);
			onLocationChange(e.latlng);
		},
	});

	return <Marker position={position} icon={customIcon} />;
}

const customIcon = new L.Icon({
	iconUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
});

interface TraditionalFormProps {
	userId: string;
}

const TraditionalForm: FunctionComponent<TraditionalFormProps> = ({
	userId,
}) => {
	const [messages, setMessages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [reportData, setReportData] = useState({
		title: '',
		location: { type: 'Point', coordinates: [0, 0] },
		description: '',
		images: [],
		assistanceNeeded: ReportAssistanceNeededEnum.DONT_REQUIRE_ASSIST,
		type: ReportTypeEnum.STRANGE_ACTIVITY,
		submissionMethod: ReportSubmissionMethodEnum.FORMS,
	});
	const { toast } = useToast();
	const router = useRouter();
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [userLocation, setUserLocation] = useState<LatLng>(
		latLng(-24.724443, -53.740623)
	);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			setUserLocation(
				latLng(position.coords.latitude, position.coords.longitude)
			);
			setReportData((prev) => ({
				...prev,
				location: {
					type: 'Point',
					coordinates: [
						position.coords.longitude,
						position.coords.latitude,
					],
				},
			}));
		});
	}, []);

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setIsLoading(true);

		try {
			const userObjectId = await getUserObjectIdById(userId);

			const reportBody: ReportSchemaInterface = {
				userId: userObjectId,
				title: reportData.title,
				location: {
					type: 'Point',
					coordinates: [
						reportData.location.coordinates[0],
						reportData.location.coordinates[1],
					],
				},
				description: reportData.description,
				images: reportData.images,
				status: ReportStatusEnum.NOT_APPLICABLE,
				assistanceNeeded: reportData.assistanceNeeded,
				type: reportData.type,
				submissionMethod: reportData.submissionMethod,
				chatHistory: messages,
				embeddings: [],
			};
			console.log('reportBody:', reportBody);
			const res = await createNewReport(reportBody);

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

		setIsLoading(false);
	};

	const handleLocationChange = (latlng: { lat: number; lng: number }) => {
		setReportData((prev) => ({
			...prev,
			location: { type: 'Point', coordinates: [latlng.lng, latlng.lat] },
		}));
	};

	return (
		<TabsContent value="form">
			<form onSubmit={handleFormSubmit} className="space-y-4">
				<div>
					<Label htmlFor="title">Título</Label>
					<Input
						id="title"
						value={reportData.title}
						onChange={(e) =>
							setReportData((prev) => ({
								...prev,
								title: e.target.value,
							}))
						}
						placeholder="Título breve para seu relatório"
						required
					/>
				</div>
				<div>
					<Label htmlFor="type">Tipo de Relatório</Label>
					<Select
						value={reportData.type}
						onValueChange={(value) =>
							setReportData((prev) => ({
								...prev,
								type: value as ReportTypeEnum,
							}))
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Selecione o tipo de relatório" />
						</SelectTrigger>
						<SelectContent>
							{validReportTypesTranslated.map((type) => (
								<SelectItem key={type.label} value={type.value}>
									{type.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label htmlFor="description">Descrição</Label>
					<Textarea
						id="description"
						value={reportData.description}
						onChange={(e) =>
							setReportData((prev) => ({
								...prev,
								description: e.target.value,
							}))
						}
						placeholder="Forneça o máximo de detalhes possível sobre o ocorrido"
						required
					/>
				</div>
				<div>
					<Label>Localização</Label>
					<div className="h-[300px] mb-2">
						<MapContainer
							center={userLocation}
							zoom={13}
							style={{
								height: '100%',
								width: '100%',
							}}
						>
							<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
							<LocationPicker
								onLocationChange={handleLocationChange}
							/>
						</MapContainer>
					</div>
				</div>
				<div>
					<Label className="flex items-center gap-2 mb-2">
						<Camera className="h-4 w-4" />
						Imagens
					</Label>
					<CldUploadWidget
						uploadPreset="ml_default"
						onSuccess={(result, { widget }) => {
							setImageUrl(
								// @ts-ignore
								result.info?.secure_url
							);
						}}
						onQueuesEnd={(result, { widget }) => {
							widget.close();
						}}
					>
						{({ open }) => (
							<Button type="button" onClick={() => open()}>
								<Camera className="h-4 w-4 mr-2" />
								Upload da Foto
							</Button>
						)}
					</CldUploadWidget>
					{imageUrl && (
						<div className="w-28">
							<img
								src={imageUrl}
								alt="Imagem do objeto"
								className="mt-4 w-full h-auto"
							/>
						</div>
					)}
				</div>
				<div>
					<Label>Você necessita assistência?</Label>
					<RadioGroup
						value={reportData.assistanceNeeded}
						onValueChange={(value) =>
							setReportData((prev) => ({
								...prev,
								assistanceNeeded:
									value as ReportAssistanceNeededEnum,
							}))
						}
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem
								value={
									ReportAssistanceNeededEnum.REQUIRE_ASSISTANCE
								}
								id="assist-sim"
							/>
							<Label htmlFor="assist-sim">
								Sim, preciso de ajuda.
							</Label>
							<RadioGroupItem
								value={
									ReportAssistanceNeededEnum.DONT_REQUIRE_ASSIST
								}
								id="assist-nao"
							/>
							<Label htmlFor="assist-nao">
								Não, quero apenas informar.
							</Label>
						</div>
					</RadioGroup>
				</div>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? (
						<>
							Enviando{' '}
							<RotatingLines
								ariaLabel="chat-loading"
								strokeColor="white"
							/>
						</>
					) : (
						<>
							<Upload className="h-4 w-4 mr-2" />
							Enviar
						</>
					)}
				</Button>
			</form>
		</TabsContent>
	);
};

export default TraditionalForm;
