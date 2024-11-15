import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import BACKEND_URL from './app/_helpers/backend-path';

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			name: 'CPF_Credentials',

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
				// Add logic here to look up the user from the credentials supplied
				if (!credentials.cpf || !credentials.password) {
					return null;
				}

				const body = {
					cpf: String(credentials.cpf),
					password: credentials.password,
				};

				const resp = await fetch(BACKEND_URL + '/db/users/login', {
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
					return {
						id: parsedResp.user._id,
						name: parsedResp.user.name,
						email: parsedResp.user.email,
						cpf: parsedResp.user.cpf,
						experience: parsedResp.user.experience,
					};
				} else {
					console.log('check your credentials');
					return null;
				}
			},
		}),
	],

	// Adds the _id field to the session
	// The user variable comes from the authorize function
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				//@ts-ignore
				token._id = user._id;
			}
			return token;
		},
		session({ session, token }) {
			//@ts-ignore
			session.user._id = token._id as string;

			return session;
		},
	},
});
