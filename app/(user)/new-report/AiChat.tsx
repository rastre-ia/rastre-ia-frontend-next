'use client';

import { FunctionComponent, useState } from 'react';
import { Send, Upload } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { MessageInterface } from '@/app/_helpers/types/ChatTypes';
import { Comment, RotatingLines } from 'react-loader-spinner';
import { chat } from '@/app/_helpers/chat/chat';
import { getPromptByType, PromptTypeEnum } from '@/app/_helpers/chat/prompts';
import 'leaflet/dist/leaflet.css';

import ReactMarkdown from 'react-markdown';
import {
	ReportAssistanceNeededEnum,
	ReportSchemaInterface,
	ReportStatusEnum,
	ReportSubmissionMethodEnum,
	ReportTypeEnum,
} from '@/app/lib/schemas/Reports';
import { toast } from '@/hooks/use-toast';
import { createNewReport } from '@/app/_helpers/db/reports';
import { useRouter } from 'next/navigation';
import {
	ChatSchemaInterface,
	MessageTypeEnum,
} from '@/app/lib/schemas/helpers/ChatSchema';
import { getUserObjectIdById } from '@/app/_helpers/db/users';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L, { LatLng, latLng } from 'leaflet';

const defaultAssistantMessage: MessageInterface = {
	role: 'assistant',
	content:
		'Olá! Estou aqui para ajudá-lo a registrar uma denúncia. O que você gostaria de relatar hoje? Seja um roubo, atividade suspeita ou qualquer outra coisa, estou aqui para ouvir e reunir detalhes importantes.',
};

const requestAssistReportsPrompt: MessageInterface[] = [
	{
		role: 'system',
		content:
			'Você é um assistente que ajuda usuários a preencher relatórios. Seu objetivo é gerar um título e uma descrição com base nas informações fornecidas. SEMPRE retorne um JSON com os campos "title", "description", "type" e "assistanceNeeded"  dentro de um bloco ```json. Não mostre o JSON ao usuário. Continue a conversa normalmente. Valores válidos para "type": "strange_activity", "traffic", "peace_disturbance", "physical_assault", "robbery" ou "other". Valores válidos para "assistanceNeeded": "require_assistance" ou "dont_require_assist".',
	},
];

function LocationPicker({
	onLocationChange,
}: {
	onLocationChange: (latlng: LatLng) => void;
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
interface AiChatProps {}

const AiChat: FunctionComponent<AiChatProps> = () => {
	const { data: session, status } = useSession();
	const [messages, setMessages] = useState<MessageInterface[]>([
		defaultAssistantMessage,
	]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isMapOpen, setIsMapOpen] = useState(false);
	const [userLocation, setUserLocation] = useState<LatLng>(
		latLng(-24.724443, -53.740623)
	);

	const router = useRouter();

	const [reportData, setReportData] = useState<{
		title: string;
		location: { type: string; coordinates: number[] };
		description: string;
		assistanceNeeded: ReportAssistanceNeededEnum;
		type: ReportTypeEnum;
		submissionMethod: ReportSubmissionMethodEnum;
	}>({
		title: '',
		location: { type: 'Point', coordinates: [0, 0] }, // Inicializa com coordenadas padrão
		description: '',
		assistanceNeeded: ReportAssistanceNeededEnum.DONT_REQUIRE_ASSIST,
		type: ReportTypeEnum.STRANGE_ACTIVITY,
		submissionMethod: ReportSubmissionMethodEnum.AI_ASSISTANT,
	});

	const extractJSONFromContent = (content: string) => {
		const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
		if (jsonMatch) {
			try {
				return JSON.parse(jsonMatch[1]);
			} catch (error) {
				console.error('Error parsing JSON:', error);
			}
		}
		return null;
	};

	const userId = session?.user?._id;

	if (status === 'unauthenticated') {
		redirect('/no-permission?redirect_to=/new-report');
	}

	if (!userId) {
		return <div>Loading...</div>;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;

		setIsLoading(true);
		setInput('');

		const newMessage: MessageInterface[] = [
			...messages,
			{ role: 'user', content: input },
		];
		setMessages(newMessage);

		const prompt = [...requestAssistReportsPrompt, ...newMessage];

		try {
			const resp = await chat(prompt, {
				temperature: 0.3,
				top_p: 0.4,
			});

			const jsonData = extractJSONFromContent(resp.response.content);
			if (jsonData) {
				setReportData((prev) => ({
					...prev,
					title: jsonData.title,
					description: jsonData.description,
					assistanceNeeded: jsonData.assistanceNeeded,
					type: jsonData.type,
				}));
			}
			console.log('jsonData:', jsonData);

			const cleanedContent = resp.response.content
				.replace(/```json[\s\S]*?```/g, '')
				.trim();
			setMessages((prev) => [
				...prev,
				{ role: 'assistant', content: cleanedContent },
			]);
		} catch (error) {
			console.error('Error fetching llm response:', error);
			setMessages((prev) => [
				...prev,
				{
					role: 'assistant',
					content:
						'Ocorreu um erro ao processar sua solicitação. Tente novamente.',
				},
			]);
		}

		setIsLoading(false);
	};

	const mapMessageToChatSchema = (
		message: MessageInterface
	): ChatSchemaInterface => {
		let activityType: MessageTypeEnum;
		switch (message.role) {
			case 'user':
				activityType = MessageTypeEnum.USER;
				break;
			case 'assistant':
				activityType = MessageTypeEnum.ASSISTANT;
				break;
			case 'system':
				activityType = MessageTypeEnum.SYSTEM;
				break;
			default:
				activityType = MessageTypeEnum.OTHER;
		}

		return {
			activityType,
			content: message.content,
			createdAt: new Date(),
		};
	};

	const handleLocationChange = (latlng: LatLng) => {
		// Atualiza o estado reportData com as novas coordenadas
		setReportData((prev) => ({
			...prev,
			location: {
				type: 'Point',
				coordinates: [latlng.lng, latlng.lat], // longitude primeiro, depois latitude
			},
		}));
	};

	const handleSubmitReport = async () => {
		if (
			reportData.location.coordinates[0] === 0 &&
			reportData.location.coordinates[1] === 0
		) {
			setIsMapOpen(true); // Abre o popup do mapa se a localização não foi selecionada
			return;
		}

		setIsLoading(true);

		try {
			const reportBody: ReportSchemaInterface = {
				userId: userId,
				title: reportData.title,
				location: {
					type: 'Point',
					coordinates: [
						reportData.location.coordinates[0],
						reportData.location.coordinates[1],
					],
				},
				description: reportData.description,
				images: [],
				status: ReportStatusEnum.NOT_APPLICABLE,
				assistanceNeeded: reportData.assistanceNeeded,
				type: reportData.type,
				submissionMethod: ReportSubmissionMethodEnum.AI_ASSISTANT,
				chatHistory: messages.map(mapMessageToChatSchema),
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

	return (
		<>
			<ScrollArea className="h-[400px] mb-4 p-4 border rounded-md">
				{messages.map((message, index) => (
					<div
						key={index}
						className={`mb-4 ${
							message.role === 'user' ? 'text-right' : 'text-left'
						}`}
					>
						<span
							className={`inline-block p-2 rounded-lg ${
								message.role === 'user'
									? 'bg-primary text-primary-foreground'
									: 'bg-muted'
							}`}
						>
							<ReactMarkdown>{message.content}</ReactMarkdown>
						</span>
					</div>
				))}
				{isLoading && (
					<Comment
						height="44"
						width="44"
						ariaLabel="chat-loading"
						color="white"
						backgroundColor="black"
					/>
				)}
				{messages.length >= 3 && (
					<Button disabled={isLoading} onClick={handleSubmitReport}>
						<Upload className="h-4 w-4 mr-2" />
						Encerrar chat e enviar relato.
					</Button>
				)}
			</ScrollArea>
			<form onSubmit={handleSubmit} className="flex gap-2">
				<Input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Digite sua mensagem aqui..."
					disabled={isLoading}
				/>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? (
						<>
							Pensando{' '}
							<RotatingLines
								ariaLabel="chat-loading"
								strokeColor="white"
							/>
						</>
					) : (
						<>
							<Send />
							Enviar mensagem
						</>
					)}
				</Button>
			</form>

			{isMapOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
					<div className="bg-white p-4 rounded-lg w-full max-w-2xl">
						<h2 className="text-lg font-bold mb-4">
							Selecione a localização
						</h2>
						<div className="h-[300px] mb-4">
							<MapContainer
								center={userLocation}
								zoom={13}
								style={{ height: '100%', width: '100%' }}
							>
								<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
								<LocationPicker
									onLocationChange={handleLocationChange}
								/>
							</MapContainer>
						</div>
						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={() => setIsMapOpen(false)}
							>
								Cancelar
							</Button>
							<Button
								onClick={() => {
									setIsMapOpen(false);
									handleSubmitReport();
									console.log('reportData:', reportData);
								}}
							>
								Confirmar Localização
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default AiChat;
