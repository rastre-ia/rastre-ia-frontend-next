declare module 'next/server' {
	interface NextRequest {
		auth?: any;
	}
}

import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt'; // Use getToken for authentication in middleware

export async function middleware(req: NextRequest) {
	const token = await getToken({ req });

	if (!token) {
		return NextResponse.redirect(new URL('/login', req.url));
	}

	req.auth = token;

	return NextResponse.next();
}
export const config = {
	matcher: ['/api/:path*'], // ***SPECIFIC MATCHER***
};
