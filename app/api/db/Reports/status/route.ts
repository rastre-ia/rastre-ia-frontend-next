import dbConnect from '@/app/lib/mongodb';
import Reports, {
	ReportSchemaInterface,
	ReportStatusEnum,
} from '@/app/lib/schemas/Reports';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

// receives an array of ids and returns an array with the status of each item
export const GET = auth(async function GET(req) {
	if (req.auth) {
		const ids = req.nextUrl.searchParams.get('ids');

		if (!ids)
			return NextResponse.json(
				{ message: 'No ids provided' },
				{ status: 400 }
			);

		const idArray = ids.split(',');

		try {
			await dbConnect();

			const reports = await Reports.find<ReportSchemaInterface>({
				_id: { $in: idArray },
			});

			const statusArray: {
				id: string;
				status: ReportStatusEnum;
			}[] = [];

			reports.forEach((item) => {
				if (!item._id || !item.status) return;

				statusArray.push({
					id: item._id.toString(),
					status: item.status,
				});
			});

			return NextResponse.json({
				statusArray: statusArray,
			});
		} catch (error) {
			console.error('Error fetching status:', error);
			return NextResponse.json(
				{ message: 'Error fetching status', error },

				{ status: 500 }
			);
		}
	}
	return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
});
