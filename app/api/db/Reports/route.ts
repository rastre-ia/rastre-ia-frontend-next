import { NextResponse, NextRequest } from 'next/server';
import Reports, {
	ReportAssistanceNeededEnum,
	ReportSchemaInterface,
	ReportStatusEnum,
} from '@/app/lib/schemas/Reports';
import { auth } from '@/auth';
import generateUserActivity from '@/app/lib/generate-user-activity';
import { ActivityTypeEnum } from '@/app/lib/schemas/UserActivities';
import dbConnect from '@/app/lib/mongodb';
import RolesEnum from '@/app/lib/schemas/helpers/RolesEnum';

export async function GET(req: NextRequest) {
	const session = await auth();
	if (!session) {
		return NextResponse.json(
			{ message: 'Not authenticated' },
			{ status: 401 }
		);
	}

	if (session.user.role !== RolesEnum.POLICE_STATION) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	const perPage = Number(req.nextUrl.searchParams.get('per_page')) || 12;
	const page = Number(req.nextUrl.searchParams.get('page')) || 0;
	const status = req.nextUrl.searchParams.get('status') || undefined;
	const type = req.nextUrl.searchParams.get('type') || undefined;

	try {
		await dbConnect();

		let query = Reports.find<ReportSchemaInterface>()
			.limit(perPage)
			.skip(perPage * page);

		if (status) query = query.where('status').equals(status);
		if (type) query = query.where('type').equals(type);

		const reports = await query.exec();
		const pageCount = Math.ceil(
			(await Reports.countDocuments().exec()) / perPage
		);

		return NextResponse.json({
			reports,
			pageCount,
		});
	} catch (error) {
		console.error('Error fetching reports:', error);
		return NextResponse.json(
			{ message: 'Error fetching reports', error },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	const session = await auth();
	if (!session) {
		return NextResponse.json(
			{ message: 'Not authenticated' },
			{ status: 401 }
		);
	}

	const {
		userId,
		title,
		location,
		description,
		images,
		assistanceNeeded,
		type,
		submissionMethod,
		chatHistory,
		embeddings,
	} = (await req.json()) as ReportSchemaInterface;

	if (userId !== session.user._id) {
		return NextResponse.json(
			{ message: 'Unauthorized to create report' },
			{ status: 401 }
		);
	}

	const status =
		assistanceNeeded === ReportAssistanceNeededEnum.REQUIRE_ASSISTANCE
			? ReportStatusEnum.PENDING
			: ReportStatusEnum.NOT_APPLICABLE;

	try {
		await dbConnect();
		const session = await Reports.startSession();

		const data: ReportSchemaInterface = {
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
		};

		const reportRegistration = await Reports.create<ReportSchemaInterface>(
			[data],
			{
				session,
			}
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

		return NextResponse.json({ message: 'Report created successfully' });
	} catch (error) {
		console.error('Error creating report:', error);
		return NextResponse.json(
			{ message: 'Error creating report', error },
			{ status: 500 }
		);
	}
}
