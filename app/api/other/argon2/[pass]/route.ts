import argon2 from '@node-rs/argon2';
import { NextResponse } from 'next/server';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ pass: string }> }
) {
	// Await the params promise to resolve
	const resolvedParams = await params;

	// Check if the pass parameter is provided
	if (!resolvedParams.pass) {
		return NextResponse.json(
			{ message: 'Missing password parameter' },
			{ status: 400 }
		);
	}

	// Hash the password
	const hashed = await argon2.hash(resolvedParams.pass);

	return NextResponse.json({ hashed });
}
