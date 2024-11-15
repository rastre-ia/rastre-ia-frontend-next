'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
	Send,
	ArrowLeft,
	MessageSquare,
	FileText,
	MapPin,
	Upload,
} from 'lucide-react';
import Link from 'next/link';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AnimatedLogo from '@/components/AnimatedLogo';
import {
	ReportAssistanceNeededEnum,
	ReportSchemaInterface,
	ReportStatusEnum,
	ReportSubmissionMethodEnum,
	ReportTypeEnum,
} from '../lib/schemas/Reports';
import { validReportTypesTranslated } from '../_helpers/report-type-translator';
import { useSession } from 'next-auth/react';
import { getUserObjectIdById } from '../_helpers/db/users';
import { createNewReport } from '../_helpers/db/reports';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

// Função mock para simular resposta de IA
const getAIResponse = async (message: string) => {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return 'Entendi que você deseja registrar um relatório. Pode fornecer mais detalhes sobre o incidente? Qual tipo de situação você está relatando?';
};

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

	return <Marker position={position} />;
}

export default function ReportPage() {
	const { data: session, status } = useSession();
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
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
	const userId = session?.user?._id;
	const { toast } = useToast();
	const router = useRouter();

	if (status !== 'authenticated') {
		return <div>Access Denied</div>;
	}

	if (!userId) {
		return <div>Loading...</div>;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;

		setInput('');
		setIsLoading(true);

		const aiResponse = await getAIResponse(input);
		// setMessages((prev) => [
		// 	...prev,
		// 	{ role: 'system', content: aiResponse },
		// ]);
		setIsLoading(false);
	};

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setInput('');
		setIsLoading(true);

		try {
			const userObjectId = await getUserObjectIdById(userId);

			const reportBody: ReportSchemaInterface = {
				userId: userObjectId,
				title: reportData.title,
				location: {
					type: 'Point',
					coordinates: [
						reportData.location.coordinates[1],
						reportData.location.coordinates[0],
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

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const fileUrls = Array.from(e.target.files).map((file) =>
				URL.createObjectURL(file)
			);

			// TODO: Upload images to cloud storage
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-2xl mx-auto"
			>
				<div className="flex justify-between items-center mb-6">
					<Link href="/my-profile">
						<Button variant="ghost" className="gap-2">
							<ArrowLeft className="h-4 w-4" />
							Voltar à minha página
						</Button>
					</Link>
					<h1 className="text-3xl font-bold text-primary">
						<AnimatedLogo className="inline" />
					</h1>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">
							Enviar Relato
						</CardTitle>
						<CardDescription>
							Escolha como gostaria de fornecer informações para
							auxiliar a investigação policial
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue="ai-chat">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="ai-chat">
									<MessageSquare className="h-4 w-4 mr-2" />
									Chat com IA
								</TabsTrigger>
								<TabsTrigger value="form">
									<FileText className="h-4 w-4 mr-2" />
									Formulário Tradicional
								</TabsTrigger>
							</TabsList>
							<TabsContent value="ai-chat">
								<ScrollArea className="h-[400px] mb-4 p-4 border rounded-md">
									{/* {messages.map((message, index) => (
										<div
											key={index}
											className={`mb-4 ${
												message.role === 'user'
													? 'text-right'
													: 'text-left'
											}`}
										>
											<span
												className={`inline-block p-2 rounded-lg ${
													message.role === 'user'
														? 'bg-primary text-primary-foreground'
														: 'bg-muted'
												}`}
											>
												{message.content}
											</span>
										</div>
									))} */}
								</ScrollArea>
								<form
									onSubmit={handleSubmit}
									className="flex gap-2"
								>
									<Input
										value={input}
										onChange={(e) =>
											setInput(e.target.value)
										}
										placeholder="Digite sua mensagem aqui..."
										disabled={isLoading}
									/>
									<Button type="submit" disabled={isLoading}>
										<Send className="h-4 w-4 mr-2" />
										Enviar
									</Button>
								</form>
							</TabsContent>
							<TabsContent value="form">
								<form
									onSubmit={handleFormSubmit}
									className="space-y-4"
								>
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
										<Label htmlFor="type">
											Tipo de Relatório
										</Label>
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
												{validReportTypesTranslated.map(
													(type) => (
														<SelectItem
															key={type.label}
															value={type.value}
														>
															{type.label}
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label htmlFor="description">
											Descrição
										</Label>
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
												center={[51.505, -0.09]}
												zoom={13}
												style={{
													height: '100%',
													width: '100%',
												}}
											>
												<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
												<LocationPicker
													onLocationChange={
														handleLocationChange
													}
												/>
											</MapContainer>
										</div>
									</div>
									<div>
										<Label>Imagens</Label>
										<div className="flex flex-col gap-2">
											<input
												type="file"
												accept="image/*"
												multiple
												onChange={handleImageUpload}
											/>
											<div className="flex gap-2">
												{reportData.images.map(
													(url, idx) => (
														<img
															key={idx}
															src={url}
															alt={`Uploaded ${idx}`}
															className="h-20 w-20 object-cover rounded-md"
														/>
													)
												)}
											</div>
										</div>
									</div>
									<div>
										<Label>
											Você necessita assistência?
										</Label>
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
									<Button type="submit">
										<Upload className="h-4 w-4 mr-2" />
										Enviar
									</Button>
								</form>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
