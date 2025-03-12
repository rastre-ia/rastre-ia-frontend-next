import dbConnect from '@/app/lib/mongodb';
import Reports, {
	ReportSchemaInterface,
	ReportStatusEnum,
} from '@/app/lib/schemas/Reports';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const session = await auth();
	if (!session) {
		return NextResponse.json(
			{ message: 'Not authenticated' },
			{ status: 401 }
		);
	}

	const ids = req.nextUrl.searchParams.get('ids');

	if (!ids) {
		return NextResponse.json(
			{ message: 'No ids provided' },
			{ status: 400 }
		);
	}

	const idArray = ids
		.split(',')
		.map((id) => id.trim())
		.filter(Boolean);

	if (idArray.length === 0) {
		return NextResponse.json(
			{ message: 'Invalid ids provided' },
			{ status: 400 }
		);
	}

	try {
		await dbConnect();

		const reports = await Reports.find({ _id: { $in: idArray } }).select(
			'_id status'
		);

		const statusArray = reports.map((item) => ({
			id: item._id.toString(),
			status: item.status,
		}));

		return NextResponse.json({ statusArray });
	} catch (error) {
		console.error('Error fetching status:', error);
		return NextResponse.json(
			{ message: 'Error fetching status', error },
			{ status: 500 }
		);
	}
}
