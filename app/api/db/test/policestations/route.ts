import dbConnect from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';
import argon2 from '@node-rs/argon2';
import PoliceStations from '@/app/lib/schemas/PoliceStations';

export async function GET() {
	await dbConnect();

	const policeStations = await PoliceStations.find({});

	return NextResponse.json({ policeStations });
}

/* sample
{
	"name": "Policia Civil Toledo",
    "email": "pf@toledo.br",
    "password": "123123"
}
*/
export async function POST(req: Request) {
	const { name, email, password } = await req.json();

	if (!name || !email || !password) {
		return NextResponse.json(
			{ message: 'Missing fields' },
			{ status: 400 }
		);
	}

	await dbConnect();

	const hashedPassword = await argon2.hash(password);

	try {
		const newPoliceStation = await PoliceStations.create({
			name: name,
			email: email,
			passwordHash: hashedPassword,
		});

		return NextResponse.json({ newPoliceStation, success: true });
	} catch (error) {
		console.error('Error creating Police station:', error);
		return NextResponse.json(
			{ message: 'Error creating Police Station' },
			{ status: 500 }
		);
	}
}
