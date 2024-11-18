import dbConnect from '@/app/lib/mongodb';
import Users from '@/app/lib/schemas/Users';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(
	request: NextRequest,
	context: { params: { id: string } }
) {
	return auth(async () => {
		const params = await context.params;

		// @ts-expect-error  auth is not defined
		if (request.auth) {
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
	})(request, context) as any;
}
