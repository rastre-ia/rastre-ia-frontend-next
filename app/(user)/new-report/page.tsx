import { ArrowLeft, MessageSquare, FileText } from 'lucide-react';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnimatedLogo from '@/components/AnimatedLogo';

import { redirect } from 'next/navigation';

import TraditionalForm from './TraditionalForm';
import AiChat from './AiChat';
import { auth } from '@/auth';

export default async function ReportPage() {
	const session = await auth();
	const user = session?.user;

	const userId = user?._id;

	if (!session) {
		redirect('/no-permission?redirect_to=/new-report');
	}

	if (!userId) {
		return <div>Loading...</div>;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-2xl mx-auto">
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
								<AiChat />
							</TabsContent>
							<TraditionalForm userId={userId} />
						</Tabs>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
