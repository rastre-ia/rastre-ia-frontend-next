import dbConnect from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';
import UserActivities, {
	ActivityTypeEnum,
} from '@/app/lib/schemas/UserActivities';
import AnswerRequests from '@/app/lib/schemas/AnswerRequests';
import Reports from '@/app/lib/schemas/Reports';
import StolenItems from '@/app/lib/schemas/StolenItems';

export async function GET() {
	await dbConnect();

	const userActivities = await UserActivities.find({});

	return NextResponse.json({ userActivities });
}

/* sample
{
	"userId": "67363fc7e3400c3a49f2d264",
    "activityType": "answer_request",
    "requestId": "6736b0a07e75ea4b7c0cf499",
    "reportId": null,
    "stolenItemId": null,
    "data": "Você ganhou uma nova medalha"
}
*/
export async function POST(req: Request) {
	const { userId, activityType, requestId, reportId, stolenItemId, data } =
		await req.json();

	await dbConnect();

	try {
		let request = null;
		let report = null;
		let stolenItem = null;

		switch (activityType) {
			case ActivityTypeEnum.ANSWER_REQUEST:
				request = await AnswerRequests.findById(requestId);
				break;
			case ActivityTypeEnum.CREATE_REPORT:
				report = await Reports.findById(reportId);
				break;
			case ActivityTypeEnum.REGISTER_STOLEN_ITEM:
				stolenItem = await StolenItems.findById(stolenItemId);
				break;
			default:
				break;
		}

		const newUserActivities = await UserActivities.create({
			userId,
			activityType,
			requestId: request?._id,
			reportId: report?._id,
			stolenItemId: stolenItem?._id,
			data,
		});

		return NextResponse.json({ newUserActivities, success: true });
	} catch (error) {
		console.error('Error creating User Activity:', error);
		return NextResponse.json(
			{ message: 'Error creating User Activity' },
			{ status: 500 }
		);
	}
}
