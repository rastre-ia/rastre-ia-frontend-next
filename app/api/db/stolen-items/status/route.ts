import dbConnect from '@/app/lib/mongodb';
import StolenItems, {
	StolenItemsSchemaInterface,
	StolenItemsStatusEnum,
} from '@/app/lib/schemas/StolenItems';
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

			const stolenItems =
				await StolenItems.find<StolenItemsSchemaInterface>({
					_id: { $in: idArray },
				});

			const statusArray: {
				id: string;
				status: StolenItemsStatusEnum;
			}[] = [];

			stolenItems.forEach((item) => {
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
