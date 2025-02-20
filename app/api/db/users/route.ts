import dbConnect from '@/app/lib/mongodb';
import Users from '@/app/lib/schemas/Users';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import argon2 from '@node-rs/argon2';
import { cepLookup } from '@/app/_helpers/brasil-api';

export async function GET(req: NextRequest) {
	// Authenticate the request
	const token = await getToken({ req });
	if (!token) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	// Extract query parameters
	const lat = req.nextUrl.searchParams.get('lat');
	const lon = req.nextUrl.searchParams.get('lon');
	const radius = req.nextUrl.searchParams.get('radius');
	const cep = req.nextUrl.searchParams.get('cep');

	await dbConnect();

	const queryResult: {
		users: unknown[];
		total: number;
	} = {
		users: [],
		total: 0,
	};

	try {
		let query = Users.find();

		// Handle CEP-based search
		if (cep) {
			if (!radius) {
				return NextResponse.json(
					{ message: 'Radius is required when using CEP' },
					{ status: 400 }
				);
			}

			const resp = await cepLookup(cep);
			if (!resp || resp.type === 'service_error') {
				return NextResponse.json(
					{ message: 'CEP not found' },
					{ status: 404 }
				);
			}

			const longitude = resp.location.coordinates.longitude;
			const latitude = resp.location.coordinates.latitude;

			if (!longitude || !latitude) {
				return NextResponse.json(
					{ message: 'Error getting coordinates from CEP' },
					{ status: 500 }
				);
			}

			const maxDistance = parseInt(radius);
			query = query.where('location').near({
				center: {
					type: 'Point',
					coordinates: [longitude, latitude],
				},
				maxDistance: maxDistance,
			});
		} else if (lat || lon || radius) {
			// Validate lat/lon/radius parameters
			if (!lat || !lon || !radius) {
				return NextResponse.json(
					{ message: 'Missing lat, lon, or radius parameter' },
					{ status: 400 }
				);
			}

			const maxDistance = parseInt(radius);
			query = query.where('location').near({
				center: {
					type: 'Point',
					coordinates: [parseFloat(lon), parseFloat(lat)],
				},
				maxDistance: maxDistance,
			});
		}

		// Execute query
		const users = await query.exec();
		queryResult.users = users;
	} catch (error) {
		console.error('Error fetching users:', error);
		return NextResponse.json(
			{ message: 'Error fetching users' },
			{ status: 500 }
		);
	}

	// Get total users count
	const usersCount = await Users.countDocuments({});
	queryResult.total = usersCount;

	return NextResponse.json(queryResult);
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
		const newUser = await new Promise(async (resolve, reject) => {
			try {
				const user = await Users.create({
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
				resolve(user);
			} catch (error) {
				reject(error);
			}
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
