'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, User } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { formatCPF, isValidCPF } from '@/app/_helpers/cpf-operations';
import { redirect } from 'next/navigation'; // Import redirect

export default function CitizenLogin() {
	const [cpf, setCpf] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [searchParams, setSearchParams] = useState<URLSearchParams | null>(
		null
	); // State for search params
	const [error, setError] = useState<string>(''); // Initialize error state

	useEffect(() => {
		setSearchParams(new URLSearchParams(window.location.search)); // Get search params after mount
	}, []);

	const searchParamError = searchParams?.get('error');
	const searchParamRedirectTo = searchParams?.get('redirect_to');

	useEffect(() => {
		// Set initial error from search params if available.
		if (searchParamError) {
			setError(searchParamError);
		}
	}, [searchParamError]); // This effect will run when searchParamError changes

	const credentialsAction = async () => {
		if (!isValidCPF(cpf)) {
			setError(
				'CPF inválido. Por favor, insira um CPF no formato XXX.XXX.XXX-XX.'
			);
			return;
		}

		const cleanedCpf = cpf.replace(/\D/g, '');

		const loginResult = await signIn('cpf_credentials', {
			password: password,
			cpf: cleanedCpf,
			redirect: false,
		});

		if (loginResult?.error) {
			setError('Credenciais inválidas. Por favor, tente novamente.');
		} else {
			// Use redirect from next/navigation
			redirect(
				searchParamRedirectTo ? searchParamRedirectTo : '/my-profile'
			);
		}
	};

	const handleCpfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const formattedCpf = formatCPF(event.target.value);
		setCpf(formattedCpf);
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				credentialsAction();
			}}
		>
			{' '}
			{/* Prevent default form submission */}
			<div className="space-y-4">
				{error && ( // Only render error if it exists
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
						maxLength={14}
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
			<Button type="submit" className="w-full mt-6">
				{' '}
				{/* Now a submit button */}
				<User className="mr-2 h-4 w-4" />
				Entrar como Cidadão
			</Button>
		</form>
	);
}
