'use client';
import { FunctionComponent } from 'react';

import { useState } from 'react';
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

const defaultAssistantMessage: MessageInterface = {
	role: 'assistant',
	content:
		'Olá! Estou aqui para ajudá-lo a registrar uma denúncia. O que você gostaria de relatar hoje? Seja um roubo, atividade suspeita ou qualquer outra coisa, estou aqui para ouvir e reunir detalhes importantes.',
};

// interface AiChatProps {}

const AiChat: FunctionComponent = () => {
	const { data: session, status } = useSession();
	const [messages, setMessages] = useState<MessageInterface[]>([
		defaultAssistantMessage,
	]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);

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

		const prompt = [...getPromptByType(PromptTypeEnum.FILL_REPORT)];

		newMessage.forEach((msg) => {
			prompt.push(msg);
		});

		try {
			const resp = await chat(prompt, {
				temperature: 0.3,
				top_p: 0.4,
			});

			setMessages((prev) => [
				...prev,
				{ role: 'assistant', content: resp.message.content },
			]);
		} catch (error) {
			console.error('Error fetching llm response:', error);
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
							{message.content}
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
					<Button disabled={isLoading}>
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
		</>
	);
};

export default AiChat;
