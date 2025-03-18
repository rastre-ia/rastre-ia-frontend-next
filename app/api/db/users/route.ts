import dbConnect from '@/app/lib/mongodb';
import Users from '@/app/lib/schemas/Users';
import argon2 from '@node-rs/argon2';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.JWT_SECRET });
	const lat = req.nextUrl.searchParams.get('lat');
	const lon = req.nextUrl.searchParams.get('lon');
	const radius = req.nextUrl.searchParams.get('radius');
	await dbConnect();

	const queryResult: {
		users: unknown[];
		total: number;
	} = {
		users: [],
		total: 0,
	};

	if (token) {
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

			// Execute the query
			const users = await query.exec();

			queryResult.users = users;
		} catch (error) {
			console.error('Error fetching users:', error);
			return NextResponse.json(
				{ message: 'Error fetching users' },
				{ status: 500 }
			);
		}
	}

	const usersCount = await Users.countDocuments({});

	queryResult.total = usersCount;

	return NextResponse.json(queryResult);
}

export async function POST(req: NextRequest) {
	const { name, email, lat, long, cep, cpf, password } = await req.json();

	if (!name || !email || !cpf || !lat || !long || !cep || !password) {
		return NextResponse.json(
			{ message: 'Missing fields' },
			{ status: 400 }
		);
	}

	if (!long || !lat)
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
				coordinates: [long, lat],
			},
			passwordHash: hashedPassword,
		});

		return NextResponse.json({ newUser, success: true });
	} catch (error) {
		console.error('Error creating user:', error);
		return NextResponse.json(
			{ message: 'Error creating user' },
			{ status: 500 }
		);
	}
}
