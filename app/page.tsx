import React from 'react';
import Link from 'next/link';

import { Button } from '../components/ui/button';
import AnimatedLogo from '../components/AnimatedLogo';
import dynamic from 'next/dynamic';

const MotionHeader = dynamic(() => import('./MotionHeader'), { ssr: false });
const ProcessFlux = dynamic(() => import('./ProcessFlux'), { ssr: false });
const FeatureCards = dynamic(() => import('./FeatureCards'), { ssr: false });
const LoginAvatar = dynamic(() => import('./LoginAvatar'), { ssr: false });

const Home: React.FC = () => {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
			<header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
				<nav className="container mx-auto px-6 py-3 flex justify-between items-center">
					<Link href="/" className="text-2xl font-bold text-primary">
						<AnimatedLogo className="inline" />
					</Link>
					<div className="space-x-4">
						<LoginAvatar />
					</div>
				</nav>
			</header>

			<main className="pt-20">
				<MotionHeader />

				<section className="container mx-auto px-6 py-20">
					<h2 className="text-3xl font-bold mb-12 text-center">
						Como Funciona
					</h2>
					<div className="grid md:grid-cols-3 gap-8">
						<FeatureCards />
					</div>
				</section>

				<ProcessFlux />

				<section className="container mx-auto px-6 py-20">
					<div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow-lg">
						<h2 className="text-3xl font-bold mb-6">
							Junte-se à Luta Contra o Crime
						</h2>
						<p className="text-lg mb-8">
							O RastreIA é mais que uma ferramenta – é uma
							iniciativa da comunidade contra roubos, assistindo
							as autoridades. Com a tecnologia de IA e
							colaboração, tornamos as comunidades mais seguras,
							um relato de cada vez.
						</p>
						<Link href="/register-item">
							<Button size="lg" className="w-full sm:w-auto">
								Registrar Item Roubado
							</Button>
						</Link>
					</div>
				</section>
			</main>
			<footer className="bg-gray-100 dark:bg-gray-900 py-8 mt-auto">
				<div className="container mx-auto px-6 text-center">
					<p>
						&copy; {new Date().getFullYear()} RastreIA. Todos os
						direitos reservados.
					</p>
				</div>
			</footer>
		</div>
	);
};

export default Home;
