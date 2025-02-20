import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Answers, { AnswersSchemaInterface } from '@/app/lib/schemas/Answers';
import Users from '@/app/lib/schemas/Users';
import AnswerRequests, {
	AnswerRequestSchemaInterface,
} from '@/app/lib/schemas/AnswerRequests';
import calculateAnswerExperience from '@/app/_helpers/calculate-answer-experience';

async function increaseXP(userId: string, requestId: string) {
	const requestBeingAnswered =
		await AnswerRequests.findById<AnswerRequestSchemaInterface>(requestId);

	if (!requestBeingAnswered) {
		throw new Error('Request being answered not found');
	}

	const amountOfXp = calculateAnswerExperience(requestBeingAnswered.priority);
	console.log('increment', amountOfXp);

	await Users.updateOne(
		{ _id: userId },
		{ $inc: { experience: amountOfXp } }
	);
}

interface AuthParams {
	auth: {
		user: {
			_id: string;
			role: string;
		};
	};
}

export async function POST(
	req: Request,
	{ params }: { params: Promise<AuthParams> }
) {
	const { auth } = await params; // Destructure auth from params

	if (auth) {
		const { answers } = (await req.json()) as {
			answers: AnswersSchemaInterface;
		};

		if ((answers.userId as string) !== auth.user._id) {
			return NextResponse.json(
				{ message: 'Unauthorized to create report' },
				{ status: 401 }
			);
		}

		try {
			await dbConnect();

			try {
				await increaseXP(
					answers.userId as string,
					answers.answerRequestId as string
				);
			} catch (error) {
				console.error('Error increasing XP:', error);
				return NextResponse.json(
					{ message: 'Invalid answerRequestId' },
					{ status: 400 }
				);
			}

			const newAnswerRequest = new Answers(answers);
			await newAnswerRequest.save();

			return NextResponse.json({
				message: 'Answer created successfully',
			});
		} catch (error) {
			console.error('Error creating Answer:', error);
			return NextResponse.json(
				{ message: 'Error creating Answer', error },
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
		const url = new URL(req.url);
		const userId = url.searchParams.get('id');

		if (auth.user._id !== userId) {
			return NextResponse.json(
				{ message: 'Unauthorized' },
				{ status: 401 }
			);
		}

		try {
			await dbConnect();

			const answers = await Answers.find<AnswersSchemaInterface>()
				.where('userId')
				.equals(userId)
				.exec();

			return NextResponse.json({
				answers: answers,
			});
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
