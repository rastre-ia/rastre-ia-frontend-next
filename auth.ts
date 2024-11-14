import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			name: 'CPF_Credentials',
			// `credentials` is used to generate a form on the sign in page.
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				cpf: {
					label: 'CPF',
					type: 'text',
					placeholder: '123.456.789-00',
				},
				password: { label: 'Senha', type: 'password' },
			},
			async authorize(credentials, req) {
				'use server';
				console.error('credentials', credentials);

				// Add logic here to look up the user from the credentials supplied
				if (!credentials.cpf || !credentials.password) {
					return null;
				}

				const body = {
					cpf: String(credentials.cpf),
					password: credentials.password,
				};

				const resp = await fetch(backendURL + '/db/users/login', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(body),
				});
				const parsedResp = await resp.json();

				if (parsedResp.success && parsedResp.user) {
					return parsedResp.user;
				} else {
					console.log('check your credentials');
					return null;
				}
			},
		}),
	],
});
