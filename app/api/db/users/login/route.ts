import dbConnect from '@/app/lib/mongodb';
import Users from '@/app/lib/schemas/Users';
import { NextResponse } from 'next/server';
import argon2 from '@node-rs/argon2';

export async function POST(req: Request) {
	const { password, cpf } = await req.json();

	await dbConnect();

	// const hashedPassword = await argon2.hash(password);

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
