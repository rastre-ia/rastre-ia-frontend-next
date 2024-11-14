import dbConnect from '@/app/lib/mongodb';
import Users from '@/app/lib/schemas/Users';
import { NextResponse } from 'next/server';

export async function GET() {
	await dbConnect();

	// const newUser = await Users.create({
	// 	name: 'John Doe',
	// 	email: 'asdfasdf',
	// 	cpf: '12345678900',
	// 	location: {
	// 		type: 'Point',
	// 		coordinates: [1, 1],
	// 	},
	// 	passwordHash: '123',
	// }).catch((err) => {
	// 	console.log(err);

	// 	throw new Error(err);
	// });

	// console.log(newUser);
	const radius = 2 * 1609.34; // 2 miles in meters (you can adjust for your unit)

	Users.find()
		.where('location')
		.near({
			center: {
				type: 'Point',
				coordinates: [1, 1],
			},
			maxDistance: radius,
		})
		.then((users) => {
			console.log(users);
		});

	return NextResponse.json({ message: 'Hello from the database!' });
}
