'use client';

import React, { FunctionComponent, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import {
	Shield,
	Search,
	FileText,
	MessageSquare,
	HelpCircle,
	Award,
} from 'lucide-react';

interface FeatureCardProps {
	icon: React.ElementType;
	title: string;
	description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
	icon: Icon,
	title,
	description,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true });
	const mainControls = useAnimation();

	useEffect(() => {
		if (isInView) {
			mainControls.start('visible');
		}
	}, [isInView]);

	return (
		<motion.div
			ref={ref}
			variants={{
				hidden: { opacity: 0, y: 75 },
				visible: { opacity: 1, y: 0 },
			}}
			initial="hidden"
			animate={mainControls}
			transition={{ duration: 0.5, delay: 0.25 }}
		>
			<Card className="h-full">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Icon className="h-6 w-6 text-primary" />
						{title}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription>{description}</CardDescription>
				</CardContent>
			</Card>
		</motion.div>
	);
};

//interface FeatureCardsProps {}

const FeatureCards: FunctionComponent = () => {
	return (
		<>
			<FeatureCard
				icon={Shield}
				title="Registrar Itens"
				description="Denuncie itens roubados com descrições detalhadas e localização."
			/>
			<FeatureCard
				icon={MessageSquare}
				title="Relato com IA"
				description="Envie relatos pelo assistente de chat de IA ou por formulário."
			/>
			<FeatureCard
				icon={Search}
				title="Busca Avançada"
				description="Nossos algoritmos de IA ajudam a localizar itens roubados."
			/>
			<FeatureCard
				icon={HelpCircle}
				title="Assistência Pública"
				description="Contribua para investigações com informações valiosas."
			/>
			<FeatureCard
				icon={Award}
				title="Experiência Gamificada"
				description="Ganhe XP, suba de nível e colete medalhas ao contribuir."
			/>
			<FeatureCard
				icon={FileText}
				title="Painel Completo"
				description="Acesse seu perfil, acompanhe seu impacto e gerencie contribuições."
			/>
		</>
	);
};

export default FeatureCards;
