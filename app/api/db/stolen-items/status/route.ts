import dbConnect from '@/app/lib/mongodb';
import StolenItems, {
	StolenItemsStatusEnum,
} from '@/app/lib/schemas/StolenItems';
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

		const stolenItems = await StolenItems.find({
			_id: { $in: idArray },
		}).select('_id status');

		const statusArray = stolenItems.map((item) => ({
			id: item._id.toString(),
			status: item.status,
		}));

		return NextResponse.json({ statusArray });
	} catch (error) {
		console.error('Error fetching status:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
