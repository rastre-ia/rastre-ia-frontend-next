'use client';

import { FunctionComponent, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { PointSchemaInterface } from '@/app/lib/schemas/helpers/PointSchema';
import { Schema } from 'mongoose';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from './ui/button';
import { Bot, Send } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { useState } from 'react';
import { MapContainer, TileLayer, Circle, useMapEvents } from 'react-leaflet';
import { Comment, RotatingLines } from 'react-loader-spinner';

import 'leaflet/dist/leaflet.css';

import { Slider } from '@/components/ui/slider';
import { LatLng, latLng } from 'leaflet';
import { chat } from '@/app/_helpers/chat/chat';
import { useToast } from '@/hooks/use-toast';
import { getPromptById, PromptTypeEnum } from '@/app/_helpers/chat/prompts';
import { getUsersInRadius } from '@/app/_helpers/db/users';
import { createNewAnswerRequest } from '@/app/_helpers/db/answer-requests';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	AnswerRequestEventTypeEnum,
	AnswerRequestPriorityEnum,
	AnswerRequestStatusEnum,
} from '@/app/lib/schemas/helpers/AnswerRequestsEnums';
import answerRequestPriorityTranslator from '@/app/_helpers/answer-request-priority-translator';
import { useSession } from 'next-auth/react';

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

interface RequestAssistDialogProps {
	children: React.ReactNode;
	location: PointSchemaInterface;
	title: string;
	id: string | Schema.Types.ObjectId;
	type: AnswerRequestEventTypeEnum;
	formattedData: string;
}

const RequestAssistDialog: FunctionComponent<RequestAssistDialogProps> = ({
	children,
	location,
	title,
	id,
	type,
	formattedData,
}) => {
	const [open, setOpen] = useState(false);

	const [assistanceTitle, setAssistanceTitle] = useState('');
	const [assistanceMessage, setAssistanceMessage] = useState('');
	const [center, setCenter] = useState<LatLng>(
		latLng(location.coordinates[1], location.coordinates[0])
	);
	const [radius, setRadius] = useState(1000);
	const [fetchingLlmResponse, setFetchingLlmResponse] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [requestPriority, setRequestPriority] =
		useState<AnswerRequestPriorityEnum>(AnswerRequestPriorityEnum.MEDIUM);
	const { toast } = useToast();
	const { data: session } = useSession();

	useEffect(() => {
		setCenter(latLng(location.coordinates[1], location.coordinates[0]));
	}, [location]);

	const handleMapClick = (latlng: { lat: number; lng: number }) => {
		setCenter(latLng(latlng.lat, latlng.lng));
	};

	const submitRequest = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const usersIds: Schema.Types.ObjectId[] = [];

		const policeStationId = session?.user?._id;
		if (!policeStationId) {
			console.error('No police station id found');
			return;
		}

		if (!assistanceTitle) {
			toast({
				title: 'Erro',
				description:
					'Você precisa preencher o título para enviar o pedido de assistência',
				variant: 'destructive',
			});
			return;
		}

		if (!assistanceMessage) {
			toast({
				title: 'Erro',
				description:
					'Você precisa preencher a mensagem para enviar o pedido de assistência',
				variant: 'destructive',
			});
			return;
		}

		setSubmitting(true);

		try {
			const usersInRadius = await getUsersInRadius(
				center.lng,
				center.lat,
				radius
			);

			usersInRadius.users.forEach((user) => {
				if (user._id) usersIds.push(user._id);
			});

			try {
				await createNewAnswerRequest({
					policeStationId: policeStationId,
					location: {
						type: 'Point',
						coordinates: [center.lng, center.lat],
					},
					requestRadius: radius,
					usersRequested: usersIds,
					priority: requestPriority,

					title: assistanceTitle,
					message: assistanceMessage,
					status: AnswerRequestStatusEnum.ON_GOING,

					eventType: type,
					reportId:
						type === AnswerRequestEventTypeEnum.REPORTS
							? id
							: undefined,
					stolenItemId:
						type === AnswerRequestEventTypeEnum.STOLEN_ITEMS
							? id
							: undefined,
				});

				toast({
					title: 'Sucesso',
					description: `Pedido de assistência criado com sucesso e enviado para ${usersIds.length} usuários`,
					variant: 'default',
				});

				setOpen(false);
			} catch (error) {
				console.error('Error creating request assist:', error);
				toast({
					title: 'Erro',
					description: 'Erro ao criar pedido de assistência',
					variant: 'destructive',
				});
			}
		} catch (error) {
			toast({
				title: 'Erro',
				description: 'Erro ao buscar usuários na área',
				variant: 'destructive',
			});
			console.error('Error fetching users in radius:', error);
		}
		setSubmitting(false);
	};

	const requestAI = async () => {
		if (!assistanceTitle) {
			toast({
				title: 'Erro',
				description:
					'Você precisa preencher o título para gerar a resposta da IA',
				variant: 'destructive',
			});
			return;
		}

		setFetchingLlmResponse(true);
		try {
			const prompt = getPromptById(
				PromptTypeEnum.REQUEST_ASSIST_REPORTS,
				`Título do pedido: ${assistanceTitle} Informações: ${formattedData}`
			);
			const resp = await chat(prompt, {
				temperature: 0.3,
				top_p: 0.4,
			});

			setAssistanceMessage(resp.message);

			toast({
				title: 'Sucesso',
				description: 'Resposta da IA gerada com sucesso',
				variant: 'default',
			});
		} catch (error) {
			console.error('Error fetching llm response:', error);
			toast({
				title: 'Erro',
				description: 'Erro ao buscar resposta da IA',
				variant: 'destructive',
			});
		}

		setFetchingLlmResponse(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-w-fit">
				<DialogHeader>
					<DialogTitle>
						Enviar pedido de assistência [
						{<span className="text-destructive">{title}</span>}]
					</DialogTitle>
					<DialogDescription>
						Isso enviará uma solicitação de assistência para todos
						os usuários dentro da area de interesse.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={submitRequest}>
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
							<MapEvents onClick={handleMapClick} />
						</MapContainer>
					</div>
					<div className="mt-2 pb-2" />
					<div>
						<Label htmlFor="title">Título*</Label>
						<Input
							type="text"
							disabled={fetchingLlmResponse || submitting}
							value={assistanceTitle}
							onChange={(e) => setAssistanceTitle(e.target.value)}
							placeholder='Ex: "Ajuda para investigação de roubo na rua 15 de setembro"'
						/>
					</div>{' '}
					<div className="mt-2 pb-2" />
					<div>
						<Label htmlFor="radius">Raio [metros]</Label>
						<div className="flex gap-4">
							<Slider
								id="radius"
								min={100}
								max={20000}
								step={100}
								value={[radius]}
								disabled={submitting}
								onValueChange={(value) => setRadius(value[0])}
								className="w-full"
							/>
							<Input
								className="w-20"
								type="number"
								value={radius}
								disabled={submitting}
								required
								onChange={(e) =>
									setRadius(Number(e.target.value))
								}
							/>
						</div>
					</div>
					<div className="mt-2 pb-2" />
					<Textarea
						placeholder={
							fetchingLlmResponse
								? 'Estou pensando...'
								: 'Mensagem para os usuários...'
						}
						rows={7}
						value={assistanceMessage}
						onChange={(e) => setAssistanceMessage(e.target.value)}
						disabled={fetchingLlmResponse || submitting}
					/>
					<div className="mt-2 pb-2" />
					<div>
						<Label htmlFor="priority">Prioridade</Label>
						<Select
							disabled={fetchingLlmResponse || submitting}
							value={requestPriority.toString()}
							onValueChange={(value) => {
								setRequestPriority(
									value as AnswerRequestPriorityEnum
								);
							}}
						>
							<SelectTrigger>
								<SelectValue placeholder="Filtrar por status" />
							</SelectTrigger>
							<SelectContent>
								{Object.values(AnswerRequestPriorityEnum).map(
									(priority, idx) => (
										<SelectItem
											key={`prioridade-${idx}`}
											value={priority}
										>
											{answerRequestPriorityTranslator(
												priority
											)}
										</SelectItem>
									)
								)}
							</SelectContent>
						</Select>
					</div>
					<div className="mt-2 pb-2" />
					<DialogFooter className="mx-auto flex w-full justify-between">
						<Button
							onClick={requestAI}
							className="mr-auto"
							variant={'outline'}
							disabled={fetchingLlmResponse || submitting}
						>
							<Bot />
							{fetchingLlmResponse ? (
								<Comment
									visible={true}
									height="80"
									width="80"
									ariaLabel="chat-loading"
									wrapperClass="comment-wrapper"
									color="white"
									backgroundColor="black"
								/>
							) : (
								<>Gerar pedido com IA</>
							)}
						</Button>
						<Button
							type="submit"
							className="ml-auto"
							disabled={fetchingLlmResponse || submitting}
						>
							{submitting ? (
								<>
									Enviando
									<RotatingLines
										ariaLabel="chat-loading"
										strokeColor="white"
									/>
								</>
							) : (
								<>
									<Send />
									Enviar
								</>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default RequestAssistDialog;
