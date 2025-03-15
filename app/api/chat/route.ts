import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import {
	MessageInterface,
	OptionsInterface,
} from '@/app/_helpers/types/ChatTypes';
import { EMBEDDINGS_URL } from '@/app/lib/embeddings-api';

export async function POST(req: NextRequest) {
	const session = await auth();

	if (!session) {
		return NextResponse.json(
			{ message: 'Not authenticated' },
			{ status: 401 }
		);
	}

	const { messages, options } = (await req.json()) as {
		messages: MessageInterface[];
		options: OptionsInterface;
	};

	// if (session.user.role !== RolesEnum.POLICE_STATION) {
	// 	return NextResponse.json(
	// 		{ message: 'Unauthorized' },
	// 		{ status: 401 }
	// 	);
	// }

	console.log('Chat Message sent: ', messages);

	try {
		const resp = await fetch(EMBEDDINGS_URL + '/chat', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				messages: messages,
				options: options,
			}),
		});

		const parsedResp = await resp.json();
		return NextResponse.json(parsedResp);
	} catch (error) {
		console.error('Error creating report:', error);
		return NextResponse.json(
			{ message: 'Error creating report', error },
			{ status: 500 }
		);
	}
}
