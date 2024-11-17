import BACKEND_URL from '../backend-path';
import { AnswersSchemaInterface } from '@/app/lib/schemas/Answers';

export async function createNewAnswer(
	answers: AnswersSchemaInterface,
	headers: Headers
) {
	const resp = await fetch(BACKEND_URL + '/db/answers', {
		method: 'POST',
		headers: headers,
		body: JSON.stringify({ answers: answers }),
	});

	return resp;
}
