import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import {
	MessageInterface,
	OptionsInterface,
} from '@/app/_helpers/types/ChatTypes';
import { EMBEDDINGS_URL } from '@/app/lib/embeddings-api';

export async function POST(req: NextRequest) {
	if ((req as any).auth) {
		try {
			const { messages, options } = (await req.json()) as {
				messages: MessageInterface[];
				options: OptionsInterface;
			};

			console.log('Chat Message sent: ', messages);

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
	} else {
		// Handle the case where authentication fails.  Important for security!
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
}
