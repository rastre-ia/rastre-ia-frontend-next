import dbConnect from '@/app/lib/mongodb';
import Users from '@/app/lib/schemas/Users';
import argon2 from '@node-rs/argon2';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { password, cpf } = await req.json();

	await dbConnect();

	const user = await Users.findOne({
		cpf: cpf,
	});

	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	const isPasswordValid = await argon2.verify(user.passwordHash, password);

	if (!isPasswordValid) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	return NextResponse.json({ user, success: true });
}
