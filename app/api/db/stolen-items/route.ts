import { dbSession } from '@/app/lib/mongodb';
import StolenItems, {
	StolenItemsSchemaInterface,
} from '@/app/lib/schemas/StolenItems';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import generateUserActivity from '@/app/lib/generate-user-activity';
import { ActivityTypeEnum } from '@/app/lib/schemas/UserActivities';

// Route to create a new stolen item report
// Uses a transaction to ensure that the user activity is created
export const POST = auth(async function POST(req) {
	if (req.auth) {
		const {
			userId,
			object,
			objectDescription,
			images,
			location,
			eventDate,
			eventDescription,
			suspectCharacteristics,
			embeddings,
		} = (await req.json()) as StolenItemsSchemaInterface;

		if ((userId as string) !== req.auth.user._id)
			return NextResponse.json(
				{ message: 'Unauthorized to create report' },
				{ status: 401 }
			);

		try {
			const session = await StolenItems.startSession();

			const stolenItemRegistration =
				await StolenItems.create<StolenItemsSchemaInterface>(
					[
						{
							userId,
							object,
							objectDescription,
							images,
							location,
							eventDate,
							eventDescription,
							suspectCharacteristics,
							embeddings,
						},
					],
					{ session: session }
				);

			await generateUserActivity(
				{
					userId,
					activityType: ActivityTypeEnum.REGISTER_STOLEN_ITEM,
					stolenItemId: stolenItemRegistration[0]._id,
				},
				session
			);

			session.endSession();

			return NextResponse.json({
				message: 'Report created successfully',
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
