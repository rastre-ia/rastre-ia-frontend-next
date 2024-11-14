import dbConnect from '@/app/lib/mongodb';
import Users from '@/app/lib/schemas/Users';
import { NextResponse } from 'next/server';
import argon2 from '@node-rs/argon2';

export async function POST(req: Request) {
	const { name, email, cpf, lon, lat, password } = await req.json();

	await dbConnect();

	const hashedPassword = await argon2.hash(password);

	try {
		const newUser = await Users.create({
			name: name,
			email: email,
			cpf: cpf,
			location: {
				type: 'Point',
				coordinates: [lon, lat],
			},
			passwordHash: hashedPassword,
		});

		return NextResponse.json({ newUser, success: true });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Error creating user' },
			{ status: 500 }
		);
	}
}
