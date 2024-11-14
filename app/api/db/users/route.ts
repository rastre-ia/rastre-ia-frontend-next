import dbConnect from '@/app/lib/mongodb';
import Users from '@/app/lib/schemas/Users';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/*
    Returns the total number of documents in the collection

    @returns {
        total: number
    }

*/

export async function GET(req: Request) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	// Validate token
	if (!token) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	await dbConnect();

	return NextResponse.json({ message: 'Hello from the database!' });
}

export async function POST(req: Request) {
	const { lat, lon, radius, cpf } = await req.json();

	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	// Validate token
	// if (!token) {
	// 	return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	// }
	// Connect to the database
	await dbConnect();

	try {
		// Start building the query
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

		if (cpf) {
			query = query.where('cpf').equals(cpf);
		}

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
