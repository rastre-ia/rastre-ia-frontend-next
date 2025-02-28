import dbConnect from '@/app/lib/mongodb';
import Users from '@/app/lib/schemas/Users';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(
	request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	return auth(async (req, ctx) => {
		const params = await context.params;

		// @ts-ignore
		if (req.auth) {
			await dbConnect();

			try {
				const user = await Users.findById(params.id);

				return NextResponse.json({ user });
			} catch (error) {
				console.error('Error fetching users:', error);
				return NextResponse.json(
					{ message: 'Error fetching users', error },
					{ status: 500 }
				);
			}
		}
		return NextResponse.json(
			{ message: 'Not authenticated' },
			{ status: 401 }
		);
	})(request, (await context.params) as any);
}
