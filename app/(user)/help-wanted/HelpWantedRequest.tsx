'use server';

import answerRequestPriorityTranslator from '@/app/_helpers/answer-request-priority-translator';
import calculateAnswerExperience from '@/app/_helpers/calculate-answer-experience';
import { createNewAnswer } from '@/app/_helpers/db/answer';
import { AnswerRequestSchemaInterface } from '@/app/lib/schemas/AnswerRequests';
import { AnswerRequestPriorityEnum } from '@/app/lib/schemas/helpers/AnswerRequestsEnums';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, MessageSquare, Star, ThumbsUp } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface HelpWantedRequestProps {
	request: AnswerRequestSchemaInterface;
	myHeaders: Headers;
	userId: string;
	answered: boolean;
}

const HelpWantedRequest = async ({
	request,
	myHeaders,
	userId,
	answered,
}: HelpWantedRequestProps) => {
	if (!request._id) {
		return null;
	}

	async function handleSubmitResponse(formData: FormData) {
		'use server';

		const responseMessage = formData.get('response_message') as string;

		await createNewAnswer(
			{
				answerRequestId: request._id as string,
				userId: userId,
				content: responseMessage,
			},
			myHeaders
		);

		revalidatePath('help-wanted');
		redirect('/help-wanted');
	}

	return (
		<Card key={request._id as string}>
			<CardHeader>
				<div className="flex justify-between items-start">
					<div>
						<CardTitle>{request.title}</CardTitle>
						<CardDescription className="flex items-center mt-1">
							<MapPin className="h-4 w-4 mr-1" />
							{/* {request.location} */}
						</CardDescription>
					</div>
					<Badge
						variant={
							request.priority === AnswerRequestPriorityEnum.HIGH
								? 'destructive'
								: 'secondary'
						}
					>
						Urgência{' '}
						{answerRequestPriorityTranslator(request.priority)}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<p className="mb-4">{request.message}</p>
				<div className="flex flex-wrap gap-2 mb-4">
					{/* {request.skillsNeeded.map((skill: any) => (
						<Badge key={skill} variant="outline">
							{skill}
						</Badge>
					))} */}
				</div>
				<div className="flex items-center justify-between flex-wrap">
					<div className="flex items-center">
						{answered ? (
							<div className="flex gap-4 align-middle bg-secondary p-2 rounded-md">
								<ThumbsUp /> Respondida
							</div>
						) : (
							<>
								<Star className="h-4 w-4 text-yellow-400 mr-1" />
								<span className="font-semibold">
									{calculateAnswerExperience(
										request.priority
									)}{' '}
									XP
								</span>
							</>
						)}
					</div>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant={answered ? 'outline' : 'default'}>
								<MessageSquare className="h-4 w-4 mr-2" />
								{answered ? 'Nova resposta' : 'Responder'}
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>
									Responder à &quot;{request.title}&quot;
								</DialogTitle>
								<DialogDescription>
									Suas informações são cruciais para esta
									investigação. Por favor, forneça qualquer
									informação relevante sobre esta solicitação.
								</DialogDescription>
							</DialogHeader>
							<form action={handleSubmitResponse}>
								<Textarea
									name="response_message"
									placeholder="Digite sua resposta aqui..."
									className="mb-4"
								/>
								<DialogClose asChild>
									<Button type="submit">
										Enviar Resposta
									</Button>
								</DialogClose>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</CardContent>
		</Card>
	);
};

export default HelpWantedRequest;
