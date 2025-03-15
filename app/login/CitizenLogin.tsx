'use client';

import { formatCPF, isValidCPF } from '@/app/_helpers/cpf-operations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, User } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function CitizenLogin() {
	const [cpf, setCpf] = useState<string>('');
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
		if (!isValidCPF(cpf)) {
			setError(
				'CPF inválido. Por favor, insira um CPF no formato XXX.XXX.XXX-XX.'
			);
			return;
		}

		// Remove all non-numeric characters
		const cleanedCpf = cpf.replace(/\D/g, '');

		const loginResult = await signIn('cpf_credentials', {
			password: password,
			cpf: cleanedCpf,
			redirect: false,
		});

		if (loginResult?.error) {
			setError('Credenciais inválidas. Por favor, tente novamente.');
		} else {
			redirect(
				searchParamRedirectTo ? searchParamRedirectTo : '/my-profile'
			); // Navigate to the new post page
		}
	};

	const handleCpfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const formattedCpf = formatCPF(event.target.value);
		setCpf(formattedCpf);
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
					<Label htmlFor="cpf">CPF</Label>
					<Input
						id="cpf"
						type="text"
						placeholder="123.456.789-10"
						value={cpf}
						onChange={handleCpfChange}
						required
						maxLength={14} // CPF length including dots and hyphen
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="password">Senha</Label>
					<div className="relative">
						<Input
							id="password"
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
			<Button
				type="submit"
				className="w-full mt-6"
				// disabled={isSubmitting}
			>
				{/* {isSubmitting ? (
					<>Carregando...</>
				) : ( */}
				<>
					<User className="mr-2 h-4 w-4" />
					Entrar como Cidadão
				</>
				{/* )} */}
			</Button>
		</form>
	);
}
