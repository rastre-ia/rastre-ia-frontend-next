import { NextRequest, NextResponse } from 'next/server'; // Import necessary types
import dbConnect from '@/app/lib/mongodb';
import UserActivities from '@/app/lib/schemas/UserActivities';

export async function GET(req: NextRequest) {
	// Type the req parameter
	if (!req.auth) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	const id = req.nextUrl?.searchParams?.get('id'); // Optional chaining for safety

	if ((id as string) !== req.auth.user._id) {
		return NextResponse.json(
			{ message: 'Unauthorized to access activities' },
			{ status: 401 }
		);
	}

	try {
		await dbConnect();

		const userActivities = await UserActivities.find({
			userId: id,
		}).sort({ createdAt: -1 });

		return NextResponse.json({ userActivities });
	} catch (error) {
		console.error('Error fetching user activities:', error);
		return NextResponse.json(
			{ message: 'Error fetching user activities', error },
			{ status: 500 }
		);
	}
}
