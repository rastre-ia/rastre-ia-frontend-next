import dbConnect from '@/app/lib/mongodb';
import Users from '@/app/lib/schemas/Users';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import argon2 from '@node-rs/argon2';
import { cepLookup } from '@/app/_helpers/brasil-api';

export async function GET(req: NextRequest) {
	const lat = req.nextUrl.searchParams.get('lat');
	const lon = req.nextUrl.searchParams.get('lon');
	const radius = req.nextUrl.searchParams.get('radius');

	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	// Validate token
	if (!token) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	await dbConnect();

	try {
		let query = Users.find();

		// Geospatial query if latitude, longitude, and radius are provided
		if (lat && lon && radius) {
			const maxDistance = parseInt(radius); // Assuming radius is in meters

			query = query.where('location').near({
				center: {
					type: 'Point',
					coordinates: [parseFloat(lon), parseFloat(lat)],
				},
				maxDistance: maxDistance,
			});
		}

		// if (cpf) {
		// 	query = query.where('cpf').equals(cpf);
		// }

		// Execute the query
		const users = await query.exec();

		return NextResponse.json({ users });
	} catch (error) {
		console.error('Error fetching users:', error);
		return NextResponse.json(
			{ message: 'Error fetching users' },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	const { name, email, cpf, cep, password } = await req.json();

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
