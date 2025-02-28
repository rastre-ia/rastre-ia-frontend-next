'use client';

import { useEffect, useState, FunctionComponent, Suspense } from 'react';
import { Upload, Camera, SuperscriptIcon } from 'lucide-react';
import { LatLng, latLng } from 'leaflet';

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
import { CldUploadWidget } from 'next-cloudinary';
import { RotatingLines } from 'react-loader-spinner';
import dynamic from 'next/dynamic';
import { SUBRESOURCE_INTEGRITY_MANIFEST } from 'next/dist/shared/lib/constants';

// Dynamically import the LeafletMap component with SSR disabled
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
	ssr: false,
	loading: () => <p>Carregando mapa...</p>,
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
				{/* Form fields */}
				<div>
					<Label htmlFor="title">Título</Label>
					<Input
						id="title"
						value={reportData.title}
						onChange={(e) =>
							setReportData({
								...reportData,
								title: e.target.value,
							})
						}
						required
					/>
				</div>

				<div>
					<Label htmlFor="description">Descrição</Label>
					<Textarea
						id="description"
						value={reportData.description}
						onChange={(e) =>
							setReportData({
								...reportData,
								description: e.target.value,
							})
						}
						required
					/>
				</div>

				<div>
					<Label>Tipo de Relatório</Label>
					<Select
						value={reportData.type}
						onValueChange={(value) =>
							setReportData({
								...reportData,
								type: value as ReportTypeEnum,
							})
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Selecione um tipo" />
						</SelectTrigger>
						<SelectContent>
							{validReportTypesTranslated.map((type) => (
								<SelectItem key={type.value} value={type.value}>
									{type.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label>Assistência Necessária</Label>
					<RadioGroup
						value={reportData.assistanceNeeded}
						onValueChange={(value) =>
							setReportData({
								...reportData,
								assistanceNeeded:
									value as ReportAssistanceNeededEnum,
							})
						}
					>
						<Label>
							<RadioGroupItem
								value={
									ReportAssistanceNeededEnum.REQUIRE_ASSIST
								}
							/>
							Sim
						</Label>
						<Label>
							<RadioGroupItem
								value={
									ReportAssistanceNeededEnum.DONT_REQUIRE_ASSIST
								}
							/>
							Não
						</Label>
					</RadioGroup>
				</div>

				<div>
					<Label>Localização</Label>
					<div className="h-[300px] mb-2">
						<Suspense fallback={<p>Carregando mapa...</p>}>
							<LeafletMap />
						</Suspense>
					</div>
				</div>

				<Button type="submit" disabled={isLoading}>
					{isLoading ? (
						<RotatingLines
							strokeColor="grey"
							strokeWidth="5"
							width="30"
							visible={true}
						/>
					) : (
						'Enviar Relatório'
					)}
				</Button>
			</form>
		</TabsContent>
	);
};

export default TraditionalForm;
