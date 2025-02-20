import dbConnect from '@/app/lib/mongodb';
import Users from '@/app/lib/schemas/Users';
import { NextRequest, NextResponse } from 'next/server';

interface AuthParams {
	auth: {
		user: {
			_id: string;
			role: string;
		};
	};
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<AuthParams> }
) {
	// Await the params to get the authentication details
	const { auth } = await params;

	// Ensure we have valid authentication
	if (auth) {
		await dbConnect();

		try {
			const user = await Users.findById(auth.user._id); // Use auth.user._id to find the user

			if (!user) {
				return NextResponse.json(
					{ message: 'User not found' },
					{ status: 404 }
				);
			}

			return NextResponse.json({ user });
		} catch (error) {
			console.error('Error fetching users:', error);
			return NextResponse.json(
				{ message: 'Error fetching users', error },
				{ status: 500 }
			);
		}
	}
	return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
}
