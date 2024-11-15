import NextAuth, { DefaultSession } from 'next-auth';
import { DefaultJWT } from '@auth/core/jwt';

declare module 'next-auth' {
	// Extend session to hold the access_token
	interface Session {
		user: {
			_id: string;
			name: string;
			email: string;
		};
	}

	// // Extend token to hold the access_token before it gets put into session
	// interface JWT {
	// 	_id: string & DefaultJWT;
	// }
}
