import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import BACKEND_URL from './app/_helpers/backend-path';

export const { handlers, signIn, signOut, auth } = NextAuth({
	pages: {
		signIn: '/login',
	},
	providers: [
		CredentialsProvider({
			name: 'CPF_Credentials',
			id: 'cpf_credentials',
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
				} else {
					console.log('check your credentials');
					return null;
				}
			},
		}),
		CredentialsProvider({
			name: 'Police_Credentials',
			id: 'police_credentials',
			credentials: {
				email: {
					label: 'Email',
					type: 'text',
					placeholder: 'police@gov.com',
				},
				password: { label: 'Senha', type: 'password' },
			},

			async authorize(credentials, req) {
				'use server';

				if (!credentials.email || !credentials.password) {
					return null;
				}

				const body = {
					email: String(credentials.email),
					password: credentials.password,
				};

				const resp = await fetch(
					BACKEND_URL + '/db/police-stations/login',
					{
						method: 'POST',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
					}
				);
				const parsedResp = await resp.json();

				if (parsedResp.success && parsedResp.policeStation) {
					return parsedResp.policeStation;
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
				//@ts-expect-error
				token._id = user._id;
				//@ts-expect-error
				token.role = user.role;
			}
			return token;
		},
		session({ session, token }) {
			//@ts-expect-error
			session.user._id = token._id as string;
			//@ts-expect-error
			session.user.role = token.role as string;

			return session;
		},
	},
});
