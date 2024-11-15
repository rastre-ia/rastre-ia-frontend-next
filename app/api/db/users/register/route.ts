import dbConnect from '@/app/lib/mongodb';
import Users from '@/app/lib/schemas/Users';
import { NextResponse } from 'next/server';
import argon2 from '@node-rs/argon2';
import { cepLookup } from '@/app/_helpers/brasil-api';

export async function POST(req: Request) {
	const { name, email, cpf, cep, password } = await req.json();

	console.error({ name, email, cpf, cep, password });

	if (!name || !email || !cpf || !cep || !password) {
		return NextResponse.json(
			{ message: 'Missing fields' },
			{ status: 400 }
		);
	}

	const resp = await cepLookup(cep);

	if (!resp)
		return NextResponse.json(
			{ message: 'Error on CEP Lookup' },
			{ status: 404 }
		);

	if (resp.type == 'service_error')
		return NextResponse.json({ message: 'CEP not found' }, { status: 404 });

	const longitude = resp.location.coordinates.longitude;
	const latitude = resp.location.coordinates.latitude;

	if (!longitude || !latitude)
		return NextResponse.json(
			{ message: 'Error getting coordinates' },
			{ status: 404 }
		);

	await dbConnect();

	const hashedPassword = await argon2.hash(password);

	try {
		const newUser = await Users.create({
			name: name,
			email: email,
			cpf: cpf,
			cep: cep,
			location: {
				type: 'Point',
				coordinates: [longitude, latitude],
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
