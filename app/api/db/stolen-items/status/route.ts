import dbConnect from '@/app/lib/mongodb';
import StolenItems, {
	StolenItemsStatusEnum,
} from '@/app/lib/schemas/StolenItems';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

function addCorsHeaders(response: NextResponse) {
	response.headers.set('Access-Control-Allow-Origin', '*');
	response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	response.headers.set(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization'
	);
	return response;
}

export async function OPTIONS() {
	return addCorsHeaders(new NextResponse(null, { status: 204 }));
}

export async function GET(req: NextRequest) {
	try {
		const session = await auth();
		if (!session) {
			const res = NextResponse.json(
				{ message: 'Not authenticated' },
				{ status: 401 }
			);
			return addCorsHeaders(res);
		}

		const ids = req.nextUrl.searchParams.get('ids');

		if (!ids) {
			const res = NextResponse.json(
				{ message: 'No ids provided' },
				{ status: 400 }
			);
			return addCorsHeaders(res);
		}

		const idArray = ids
			.split(',')
			.map((id) => id.trim())
			.filter(Boolean);

		if (idArray.length === 0) {
			const res = NextResponse.json(
				{ message: 'Invalid ids provided' },
				{ status: 400 }
			);
			return addCorsHeaders(res);
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

			const res = NextResponse.json({ statusArray });
			return addCorsHeaders(res);
		} catch (error) {
			console.error('Error fetching status:', error);
			const res = NextResponse.json(
				{ message: 'Internal server error' },
				{ status: 500 }
			);
			return addCorsHeaders(res);
		}
	} catch (error) {
		console.error('Unexpected error:', error);
		const res = NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
		return addCorsHeaders(res);
	}
}
