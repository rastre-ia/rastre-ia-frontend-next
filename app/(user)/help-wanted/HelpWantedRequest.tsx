'use server';

import { FunctionComponent } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import { MessageSquare, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function urgencyToXp(urgency: string) {
	switch (urgency) {
		case 'Alta':
			return 75;
		case 'Média':
			return 35;
		case 'Baixa':
			return 10;
		default:
			return 0;
	}
}

interface HelpWantedRequestProps {
	request: any;
}

const HelpWantedRequest: FunctionComponent<HelpWantedRequestProps> = async ({
	request,
}) => {
	async function handleSubmitResponse(formData: FormData) {
		'use server';

		console.log(`Resposta enviada para a solicitação:`, formData);
	}
	return (
		<Card key={request.id}>
			<CardHeader>
				<div className="flex justify-between items-start">
					<div>
						<CardTitle>{request.title}</CardTitle>
						<CardDescription className="flex items-center mt-1">
							<MapPin className="h-4 w-4 mr-1" />
							{request.location}
						</CardDescription>
					</div>
					<Badge
						variant={
							request.urgency === 'Alta'
								? 'destructive'
								: 'secondary'
						}
					>
						Urgência {request.urgency}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<p className="mb-4">{request.description}</p>
				<div className="flex flex-wrap gap-2 mb-4">
					{request.skillsNeeded.map((skill: any) => (
						<Badge key={skill} variant="outline">
							{skill}
						</Badge>
					))}
				</div>
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<Star className="h-4 w-4 text-yellow-400 mr-1" />
						<span className="font-semibold">
							{urgencyToXp(request.urgency)} XP
						</span>
					</div>
					<Dialog>
						<DialogTrigger asChild>
							<Button>
								<MessageSquare className="h-4 w-4 mr-2" />
								Responder
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>
									Responder à Solicitação
								</DialogTitle>
								<DialogDescription>
									Suas informações são cruciais para esta
									investigação. Por favor, forneça qualquer
									informação relevante sobre esta solicitação.
								</DialogDescription>
							</DialogHeader>
							<form action={handleSubmitResponse}>
								<Textarea
									name="response"
									placeholder="Digite sua resposta aqui..."
									className="mb-4"
								/>
								<Button type="submit">Enviar Resposta</Button>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</CardContent>
		</Card>
	);
};

export default HelpWantedRequest;
