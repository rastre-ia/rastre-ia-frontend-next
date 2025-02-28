'use client';

import { motion } from 'framer-motion';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CitizenLogin from './CitizenLogin';
import PoliceLogin from './PoliceLogin';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

export default function Login() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
			<Card className="w-full max-w-md overflow-hidden">
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<CardHeader className="space-y-1">
						<div className="flex items-center justify-center mb-4">
							<Shield className="h-12 w-12 text-primary" />
						</div>
						<CardTitle className="text-2xl text-center">
							Bem-vindo ao RastreIA
						</CardTitle>
						<CardDescription className="text-center">
							Faça login para acessar a plataforma RastreIA
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue="citizen">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="citizen">
									Cidadão
								</TabsTrigger>
								<TabsTrigger value="police">
									Policial
								</TabsTrigger>
							</TabsList>
							<TabsContent value="citizen">
								<Suspense fallback={<div>Carregando...</div>}>
									<CitizenLogin />
								</Suspense>
							</TabsContent>
							<TabsContent value="police">
								<Suspense fallback={<div>Carregando...</div>}>
									<PoliceLogin />
								</Suspense>
							</TabsContent>
						</Tabs>
					</CardContent>
					<CardFooter className="flex justify-center">
						<p className="text-sm text-muted-foreground">
							Não tem uma conta?{' '}
							<Link
								href="/signup"
								className="text-primary hover:underline"
							>
								Cadastre-se
							</Link>
						</p>
					</CardFooter>
				</motion.div>
			</Card>
			<motion.div
				className="absolute top-4 left-4"
				initial={{ opacity: 0, x: -50 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				<Link href="/">
					<Button variant="ghost" className="gap-2">
						<ArrowLeft className="h-4 w-4" />
						Voltar à Página Inicial
					</Button>
				</Link>
			</motion.div>
		</div>
	);
}
