'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader, Shield } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function PoliceLogin() {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const searchParams = useSearchParams();
	const searchParamError = searchParams.get('error');
	const searchParamRedirectTo = searchParams.get('redirect_to');
	const [isPending, startTransition] = useTransition();

	const [error, setError] = useState<string>(
		searchParamError
			? 'Credenciais inválidas. Por favor, tente novamente.'
			: ''
	);

	const credentialsAction = async () => {
		startTransition(async () => {
			const loginResult = await signIn('police_credentials', {
				password: password,
				email: email,
				redirect: false,
			});

			if (loginResult?.error) {
				console.error('Error logging in:', loginResult);

				switch (loginResult.code) {
					case 'CredentialsSignin':
						setError(
							'Credenciais inválidas. Por favor, tente novamente.'
						);
						break;
					case 'EmailVerification':
						setError(
							'Email não verificado. Por favor, verifique seu email.'
						);
						break;

					default:
						setError('Erro ao entrar. Por favor, tente novamente.');
						break;
				}
			} else if (loginResult?.ok) {
				redirect(
					searchParamRedirectTo ? searchParamRedirectTo : '/dashboard'
				);
			}
		});
	};

	return (
		<form action={credentialsAction}>
			<div className="space-y-4">
				{error && (
					<div className="text-red-600 text-sm">
						<span>{error}</span>
					</div>
				)}
				<div className="space-y-2">
					<Label htmlFor="email-police">Email</Label>
					<Input
						id="email-police"
						type="email"
						placeholder="policial@governo.gov"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="password-police">Senha</Label>
					<div className="relative">
						<Input
							id="password-police"
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
							<span className="sr-only">
								{showPassword
									? 'Ocultar senha'
									: 'Mostrar senha'}
							</span>
						</Button>
					</div>
				</div>
			</div>
			<Button type="submit" className="w-full mt-6" disabled={isPending}>
				{isPending ? (
					<>
						<Loader className="mr-2 h-4 w-4" />
						Entrando...
					</>
				) : (
					<>
						<Shield className="mr-2 h-4 w-4" />
						Entrar como Policial
					</>
				)}
			</Button>
		</form>
	);
}
