import { NextResponse } from 'next/server';
import Reports, { ReportSchemaInterface } from '@/app/lib/schemas/Reports';
import { auth } from '@/auth';
import generateUserActivity from '@/app/lib/generate-user-activity';
import { ActivityTypeEnum } from '@/app/lib/schemas/UserActivities';

export const POST = auth(async function POST(req) {
	if (req.auth) {
		const {
			userId,
			title,
			location,
			description,
			images,
			status,
			assistanceNeeded,
			type,
			submissionMethod,
			chatHistory,
			embeddings,
		} = (await req.json()) as ReportSchemaInterface;

		if ((userId as string) !== req.auth.user._id)
			return NextResponse.json(
				{ message: 'Unauthorized to create report' },
				{ status: 401 }
			);

		try {
			const session = await Reports.startSession();

			const reportRegistration =
				await Reports.create<ReportSchemaInterface>(
					[
						{
							userId,
							title,
							location,
							description,
							images,
							status,
							assistanceNeeded,
							type,
							submissionMethod,
							chatHistory,
							embeddings,
						},
					],
					{ session: session }
				);

			await generateUserActivity(
				{
					userId,
					activityType: ActivityTypeEnum.CREATE_REPORT,
					reportId: reportRegistration[0]._id,
				},
				session
			);

			await session.endSession();

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
