import dbConnect from '@/app/lib/mongodb';
import Users from '@/app/lib/schemas/Users';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } } // Updated to destructure params directly
) {
	// Call the auth function directly and return its result
	return auth(async () => {
		// @ts-expect-error - This is a valid check
		if (request.auth) {
			await dbConnect();

			try {
				const user = await Users.findById(params.id); // Access params.id directly

				if (!user) {
					return NextResponse.json(
						{ message: 'User not found' },
						{ status: 404 }
					);
				}

				return NextResponse.json({ user });
			} catch (error) {
				console.error('Error fetching user:', error);
				return NextResponse.json(
					{ message: 'Error fetching user', error },
					{ status: 500 }
				);
			}
		}
		return NextResponse.json(
			{ message: 'Not authenticated' },
			{ status: 401 }
		);
	})(request, { params }); // Pass params as part of the context
}
