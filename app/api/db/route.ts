import dbConnect from '@/app/lib/mongodb';
import Users from '@/app/lib/schemas/Users';
import { NextResponse } from 'next/server';

// export async function GET() {
// 	await dbConnect();

// 	const radius = 2 * 1609.34; // 2 miles in meters (you can adjust for your unit)

// 	Users.find()
// 		.where('location')
// 		.near({
// 			center: {
// 				type: 'Point',
// 				coordinates: [1, 1],
// 			},
// 			maxDistance: radius,
// 		})
// 		.then((users) => {
// 		});

// 	return NextResponse.json({ message: 'Hello from the database!' });
// }
