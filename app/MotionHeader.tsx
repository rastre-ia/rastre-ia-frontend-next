'use client';

import { FunctionComponent } from 'react';
import { motion } from 'framer-motion';
import AnimatedLogo from '@/components/AnimatedLogo';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface MotionHeaderProps {}

const MotionHeader: FunctionComponent<MotionHeaderProps> = () => {
	return (
		<section className="container mx-auto px-6 py-20 text-center">
			<motion.h1
				className="text-5xl font-bold mb-6"
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				Bem-vindo ao <AnimatedLogo className="inline" />
			</motion.h1>
			<motion.p
				className="text-xl mb-8 max-w-2xl mx-auto"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				Empoderando comunidades e policiais com recuperação de itens
				roubados e assistência pública usando IA.
			</motion.p>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.4 }}
				className="space-x-4"
			>
				<Link href="/register-item">
					<Button size="lg">Registrar Item Roubado</Button>
				</Link>
				<Link href="/new-report">
					<Button size="lg" variant="outline">
						Enviar Relato
					</Button>
				</Link>
			</motion.div>
		</section>
	);
};

export default MotionHeader;
