import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import UserActivities from '@/app/lib/schemas/UserActivities';
import { auth } from '@/auth';

export const GET = async (req: NextRequest) => {
	const session = await auth();
	const userId = req.nextUrl.searchParams.get('id');

	if (!session || !userId || userId !== session.user._id) {
		return NextResponse.json(
			{ message: 'Unauthorized access' },
			{ status: 401 }
		);
	}

	try {
		await dbConnect();

		const userActivities = await UserActivities.find({ userId }).sort({
			createdAt: -1,
		});

		return NextResponse.json({ userActivities });
	} catch (error) {
		console.error('Error fetching user activities:', error);
		return NextResponse.json(
			{ message: 'Error fetching activities' },
			{ status: 500 }
		);
	}
};
