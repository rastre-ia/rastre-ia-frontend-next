import dbConnect from '@/app/lib/mongodb';
import UserActivities from '@/app/lib/schemas/UserActivities';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const GET = auth(async function GET(req) {
	if (req.auth) {
		const id = req.nextUrl.searchParams.get('id');

		if ((id as string) !== req.auth.user._id)
			return NextResponse.json(
				{ message: 'Unauthorized to create report' },
				{ status: 401 }
			);

		try {
			await dbConnect();

			const userActivities = await UserActivities.find({
				userId: id,
			}).sort({ createdAt: -1 });

			return NextResponse.json({
				userActivities,
			});
		} catch (error) {
			console.error('Error creating report:', error);
			return NextResponse.json(
				{ message: 'Error creating report', error },

				{ status: 500 }
			);
		}
	}
	return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
});
