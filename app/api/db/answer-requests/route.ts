import { NextResponse } from 'next/server';
import AnswerRequests, {
	AnswerRequestSchemaInterface,
} from '@/app/lib/schemas/AnswerRequests';
import dbConnect from '@/app/lib/mongodb';
import RolesEnum from '@/app/lib/schemas/helpers/RolesEnum';

interface AuthParams {
	auth: {
		user: {
			_id: string;
			role: string; // Ensure you include the role for authorization checks
			// Add other properties of user as needed
		};
	};
}

export async function POST(
	req: Request,
	{ params }: { params: Promise<AuthParams> }
) {
	const { auth } = await params;
	if (auth) {
		const { answerRequest } = (await req.json()) as {
			answerRequest: AnswerRequestSchemaInterface;
		};

		if ((answerRequest.policeStationId as string) !== auth.user._id) {
			return NextResponse.json(
				{ message: 'Unauthorized to create report' },
				{ status: 401 }
			);
		}

		try {
			await dbConnect();

			const newAnswerRequest = new AnswerRequests(answerRequest);
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
}

export async function GET(
	req: Request,
	{ params }: { params: Promise<AuthParams> }
) {
	const { auth } = await params; // Destructure auth from params
	if (auth) {
		const userId = (await params).auth.user._id;

		if (auth.user._id !== userId) {
			return NextResponse.json(
				{ message: 'Unauthorized' },
				{ status: 401 }
			);
		}

		try {
			await dbConnect();

			const response: {
				answerRequests: AnswerRequestSchemaInterface[];
				total: number;
			} = {
				answerRequests: [],
				total: 0,
			};

			const answerRequestsCount = await AnswerRequests.countDocuments({});
			response.total = answerRequestsCount;

			if (auth.user.role === RolesEnum.USER) {
				const answerRequests =
					await AnswerRequests.find<AnswerRequestSchemaInterface>()
						.where('usersRequested')
						.equals(userId)
						.exec();
				response.answerRequests = answerRequests;
			}
			if (auth.user.role === RolesEnum.POLICE_STATION) {
				const answerRequests =
					await AnswerRequests.find<AnswerRequestSchemaInterface>()
						.where('policeStationId')
						.equals(userId)
						.exec();
				response.answerRequests = answerRequests;
			}

			return NextResponse.json(response);
		} catch (error) {
			console.error('Error fetching reports:', error);
			return NextResponse.json(
				{ message: 'Error fetching reports', error },
				{ status: 500 }
			);
		}
	}
	return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
}
