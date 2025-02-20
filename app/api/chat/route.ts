import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
	MessageInterface,
	OptionsInterface,
} from '@/app/_helpers/types/ChatTypes';
import { EMBEDDINGS_URL } from '@/app/lib/embeddings-api';

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ auth: string }> }
) {
	const auth = (await params).auth;
	if (auth) {
		const { messages, options } = (await req.json()) as {
			messages: MessageInterface[];
			options: OptionsInterface;
		};

		console.log('Chat Message sent: ', messages);

		try {
			const resp = await fetch(EMBEDDINGS_URL + '/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					messages,
					options,
				}),
			});

			return NextResponse.json(await resp.json());
		} catch (error) {
			console.error('Error creating report:', error);
			return NextResponse.json(
				{ message: 'Error creating report', error },
				{ status: 500 }
			);
		}
	}
	return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
}
