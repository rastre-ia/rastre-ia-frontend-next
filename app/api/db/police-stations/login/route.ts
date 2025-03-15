import dbConnect from '@/app/lib/mongodb';
import PoliceStations from '@/app/lib/schemas/PoliceStations';
import argon2 from '@node-rs/argon2';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { password, email } = await req.json();

	if (!email || !password) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	await dbConnect();

	const policeStation = await PoliceStations.findOne({
		email: email,
	});

	if (!policeStation) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	const isPasswordValid = await argon2.verify(
		policeStation.passwordHash,
		password
	);

	if (!isPasswordValid) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	return NextResponse.json({ policeStation, success: true });
}
