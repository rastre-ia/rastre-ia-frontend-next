'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { redirect, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function PoliceLogin({}: {}) {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const searchParams = useSearchParams();
	const searchParamError = searchParams.get('error');
	const searchParamRedirectTo = searchParams.get('redirect_to');

	const [error, setError] = useState<string>(
		searchParamError
			? 'Credenciais inválidas. Por favor, tente novamente.'
			: ''
	);

	const credentialsAction = async () => {
		const loginResult = await signIn('police_credentials', {
			password: password,
			email: email,
			redirect: false,
		});

		if (loginResult?.error) {
			setError('Credenciais inválidas. Por favor, tente novamente.');
		} else {
			redirect(
				searchParamRedirectTo ? searchParamRedirectTo : '/dashboard'
			); // Navigate to the new post page
		}
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
			<Button type="submit" className="w-full mt-6">
				<Shield className="mr-2 h-4 w-4" />
				Entrar como Policial
			</Button>
		</form>
	);
}
