import calculateAnswerExperience from '@/app/_helpers/calculate-answer-experience';
import dbConnect from '@/app/lib/mongodb';
import AnswerRequests, {
	AnswerRequestSchemaInterface,
} from '@/app/lib/schemas/AnswerRequests';
import Answers, { AnswersSchemaInterface } from '@/app/lib/schemas/Answers';
import Users from '@/app/lib/schemas/Users';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(req: NextRequest) {
	const session = await auth();
	if (!session) {
		return NextResponse.json(
			{ message: 'Not authenticated' },
			{ status: 401 }
		);
	}

	const { answers } = (await req.json()) as {
		answers: AnswersSchemaInterface;
	};

	if ((answers.userId as string) !== session.user._id) {
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

export async function GET(req: NextRequest) {
	const session = await auth();
	if (!session) {
		return NextResponse.json(
			{ message: 'Not authenticated' },
			{ status: 401 }
		);
	}

	const userId = req.nextUrl.searchParams.get('id');

	if (session.user._id !== userId) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
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
