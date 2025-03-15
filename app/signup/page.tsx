'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import { useToast } from '@/hooks/use-toast';
import AnimatedLogo from '@/components/AnimatedLogo';
import BACKEND_URL from '../_helpers/backend-path';
import { formatCPF, isValidCPF } from '@/app/_helpers/cpf-operations';
import { signIn } from 'next-auth/react';

const formatCEP = (cep: string) => {
	// Remove all non-numeric characters
	const cleanedCEP = cep.replace(/\D/g, '');

	// Add formatting (XXXXX-XXX)
	if (cleanedCEP.length <= 5) {
		return cleanedCEP;
	}
	return `${cleanedCEP.slice(0, 5)}-${cleanedCEP.slice(5)}`;
};

export default function SignUp() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [cep, setCep] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [cpf, setCpf] = useState<string>('');

	const { toast } = useToast();

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsSubmitting(true);

		// Validation
		if (password !== confirmPassword) {
			toast({
				title: 'Error',
				description:
					'As senhas são diferentes. Por favor, tente novamente.',
				variant: 'destructive',
			});
			setIsSubmitting(false);
			return;
		}

		if (!isValidCPF(cpf)) {
			toast({
				title: 'Error',
				description:
					'CPF inválido. Por favor, insira um CPF no formato XXX.XXX.XXX-XX.',
				variant: 'destructive',
			});
			setIsSubmitting(false);
			return;
		}

		// Here you would typically send the registration data to your backend
		try {
			const cleanedCEP = cep.replace(/\D/g, '');
			const cleanedCpf = cpf.replace(/\D/g, '');

			const body = {
				name: name,
				email: email,
				password: password,
				cep: cleanedCEP,
				cpf: cleanedCpf,
			};

			const resp = await fetch(BACKEND_URL + '/db/users', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});
			const parsedResp = await resp.json();

			if (!parsedResp.success) {
				throw new Error('Error creating user');
			}

			toast({
				title: 'Success',
				description:
					'Your account has been created. Welcome to RastreIA!',
			});
			setIsSubmitting(false);
			signIn('credentials', {
				password: password,
				cpf: cleanedCpf,
				redirectTo: '/my-profile',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description:
					'There was a problem creating your account. Please try again.',
				variant: 'destructive',
			});
			setIsSubmitting(false);
			console.error(error);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-4">
			<Card className="w-full max-w-md">
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<CardHeader className="space-y-1">
						<div className="flex items-center justify-between">
							<CardTitle className="text-2xl">
								Crie uma conta
							</CardTitle>
							<UserPlus className="h-6 w-6 text-primary" />
						</div>
						<CardDescription>
							Junte-se a <AnimatedLogo className="inline" /> e
							ajude a tornar sua comunidade mais segura
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit}>
							<div className="grid gap-4">
								<div className="grid gap-2">
									<Label htmlFor="name">Nome completo</Label>
									<Input
										id="name"
										placeholder="João da Silva"
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="cpf">CPF</Label>
									<Input
										id="cpf"
										type="text"
										placeholder="123.456.789-10"
										value={cpf}
										onChange={(e) => {
											const formattedCpf = formatCPF(
												e.target.value
											);
											setCpf(formattedCpf);
										}}
										required
										maxLength={14} // CPF length including dots and hyphen
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="joao@exemplo.com"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="location">CEP</Label>
									<Input
										id="location"
										placeholder="12345-000"
										value={cep}
										onChange={(e) =>
											setCep(formatCEP(e.target.value))
										}
										required
										maxLength={9}
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="password">Senha</Label>
									<div className="relative">
										<Input
											id="password"
											type={
												showPassword
													? 'text'
													: 'password'
											}
											value={password}
											onChange={(e) =>
												setPassword(e.target.value)
											}
											min={6}
											max={256}
											required
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={() =>
												setShowPassword(!showPassword)
											}
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
											<span className="sr-only">
												{showPassword
													? 'Hide password'
													: 'Show password'}
											</span>
										</Button>
									</div>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="confirmPassword">
										Confirmar senha
									</Label>
									<Input
										id="confirmPassword"
										type="password"
										value={confirmPassword}
										onChange={(e) =>
											setConfirmPassword(e.target.value)
										}
										required
									/>
								</div>

								<Button
									type="submit"
									className="w-full"
									disabled={isSubmitting}
								>
									{isSubmitting
										? 'Criando uma conta...'
										: 'Criar conta'}
								</Button>
							</div>
						</form>
					</CardContent>
					<CardFooter className="flex flex-col items-center">
						<p className="mt-2 text-sm text-muted-foreground">
							Já possui uma conta?{' '}
							<Link
								href="/login"
								className="text-primary hover:underline"
							>
								Login
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
