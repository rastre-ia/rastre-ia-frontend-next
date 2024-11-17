import BACKEND_URL from '../backend-path';
import {
	ChatResponseInterface,
	MessageInterface,
	OptionsInterface,
} from '../types/ChatTypes';

export async function chat(
	messages: MessageInterface[],
	options?: OptionsInterface
): Promise<ChatResponseInterface> {
	const resp = await fetch(BACKEND_URL + '/chat', {
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

	return parsedResp;
}
