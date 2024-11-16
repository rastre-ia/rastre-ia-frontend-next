import { NextResponse } from 'next/server';
import Reports, { ReportSchemaInterface } from '@/app/lib/schemas/Reports';
import { auth } from '@/auth';
import generateUserActivity from '@/app/lib/generate-user-activity';
import { ActivityTypeEnum } from '@/app/lib/schemas/UserActivities';
import dbConnect from '@/app/lib/mongodb';
import RolesEnum from '@/app/lib/schemas/helpers/RolesEnum';

export const GET = auth(async function GET(req) {
	if (req.auth) {
		if (req.auth.user.role !== RolesEnum.POLICE_STATION) {
			return NextResponse.json(
				{ message: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const perPage = Number(req.nextUrl.searchParams.get('per_page')) ?? 10;
		const page = Number(req.nextUrl.searchParams.get('page')) ?? 0;
		const status = req.nextUrl.searchParams.get('status') ?? undefined; // Undefined means all
		const type = req.nextUrl.searchParams.get('type') ?? undefined;

		try {
			await dbConnect();

			let query = Reports.find<ReportSchemaInterface>();

			query = query.limit(perPage).skip(perPage * page);

			if (status) query = query.where('status').equals(status);

			if (type) query = query.where('type').equals(type);

			const reports = await await query.exec();

			const pageCount = Math.ceil(reports.length / perPage);

			return NextResponse.json({
				reports: reports,
				pageCount: pageCount,
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
});

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
