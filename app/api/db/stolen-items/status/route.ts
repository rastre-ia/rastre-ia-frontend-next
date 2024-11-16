import dbConnect from '@/app/lib/mongodb';
import StolenItems, {
	StolenItemsSchemaInterface,
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

		console.log('idArraya', idArray);

		try {
			await dbConnect();

			const stolenItems = await StolenItems.find({
				_id: { $in: idArray },
			});

			const statusArray = stolenItems.map((item) => ({
				id: item._id,
				status: item.status,
			}));

			return NextResponse.json(statusArray);
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
