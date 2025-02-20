import { NextResponse } from 'next/server';
import Reports, {
	ReportAssistanceNeededEnum,
	ReportSchemaInterface,
	ReportStatusEnum,
} from '@/app/lib/schemas/Reports';
import generateUserActivity from '@/app/lib/generate-user-activity';
import { ActivityTypeEnum } from '@/app/lib/schemas/UserActivities';
import dbConnect from '@/app/lib/mongodb';
import RolesEnum from '@/app/lib/schemas/helpers/RolesEnum';

export async function GET(
	req: Request,
	{ params }: { params: Promise<AuthParams> }
) {
	const { auth } = await params; // Destructure auth from params

	if (auth) {
		if (auth.user.role !== RolesEnum.POLICE_STATION) {
			return NextResponse.json(
				{ message: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const url = new URL(req.url);
		const perPage = Number(url.searchParams.get('per_page')) ?? 12;
		const page = Number(url.searchParams.get('page')) ?? 0;
		const status = url.searchParams.get('status') ?? undefined; // Undefined means all
		const type = url.searchParams.get('type') ?? undefined;

		try {
			await dbConnect();

			let query = Reports.find<ReportSchemaInterface>();

			query = query.limit(perPage).skip(perPage * page);

			if (status) query = query.where('status').equals(status);
			if (type) query = query.where('type').equals(type);

			const reports = await query.exec();
			const pageCount = Math.ceil(
				(await Reports.countDocuments().exec()) / perPage
			);

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

		if ((userId as string) !== auth.user._id) {
			return NextResponse.json(
				{ message: 'Unauthorized to create report' },
				{ status: 401 }
			);
		}

		const sts =
			assistanceNeeded === ReportAssistanceNeededEnum.REQUIRE_ASSISTANCE
				? ReportStatusEnum.PENDING
				: ReportStatusEnum.NOT_APPLICABLE;

		try {
			const session = await Reports.startSession();

			const data: ReportSchemaInterface = {
				userId: userId,
				title: title,
				location: location,
				description: description,
				images: images,
				status: sts,
				assistanceNeeded: assistanceNeeded,
				type: type,
				submissionMethod: submissionMethod,
				chatHistory: chatHistory,
				embeddings: embeddings,
			};

			const reportRegistration =
				await Reports.create<ReportSchemaInterface>([data], {
					session: session,
				});

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
}
