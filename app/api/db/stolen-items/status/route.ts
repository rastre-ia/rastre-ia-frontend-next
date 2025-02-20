import dbConnect from '@/app/lib/mongodb';
import StolenItems, {
	StolenItemsSchemaInterface,
	StolenItemsStatusEnum,
} from '@/app/lib/schemas/StolenItems';
import { NextResponse } from 'next/server';

interface AuthParams {
	auth: {
		user: {
			_id: string;
			role: string;
		};
	};
}
// receives an array of ids and returns an array with the status of each item
export async function GET(
	req: Request,
	{ params }: { params: Promise<AuthParams> }
) {
	const { auth } = await params; // Destructure auth from params

	if (auth) {
		const url = new URL(req.url);
		const ids = url.searchParams.get('ids');

		if (!ids) {
			return NextResponse.json(
				{ message: 'No ids provided' },
				{ status: 400 }
			);
		}

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
}
