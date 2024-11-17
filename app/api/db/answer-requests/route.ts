import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import AnswerRequests, {
	AnswerRequestSchemaInterface,
} from '@/app/lib/schemas/AnswerRequests';
import dbConnect from '@/app/lib/mongodb';

export const POST = auth(async function POST(req) {
	if (req.auth) {
		const {
			policeStationId,
			location,
			requestRadius,
			usersRequested,
			priority,
			message,
			status,
		} = (await req.json()) as AnswerRequestSchemaInterface;

		if ((policeStationId as string) !== req.auth.user._id)
			return NextResponse.json(
				{ message: 'Unauthorized to create report' },
				{ status: 401 }
			);

		try {
			await dbConnect();

			const newAnswerRequest = new AnswerRequests({
				policeStationId,
				location,
				requestRadius,
				usersRequested,
				priority,
				message,
				status,
			});

			await newAnswerRequest.save();

			return NextResponse.json({
				message: 'Answer Request created successfully',
			});
		} catch (error) {
			console.error('Error creating Answer Request:', error);
			return NextResponse.json(
				{ message: 'Error creating Answer Request', error },

				{ status: 500 }
			);
		}
	}
	return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
});
