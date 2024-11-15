import dbConnect from '@/app/lib/mongodb';
import Users from '@/app/lib/schemas/Users';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import argon2 from '@node-rs/argon2';
import { cepLookup } from '@/app/_helpers/brasil-api';

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	// Validate token
	if (!token) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	const id = await params.id;

	await dbConnect();

	try {
		const user = await Users.findById(id);

		return NextResponse.json({ user });
	} catch (error) {
		console.error('Error fetching users:', error);
		return NextResponse.json(
			{ message: 'Error fetching users', error },
			{ status: 500 }
		);
	}
}
