import { AnswerRequestSchemaInterface } from '@/app/lib/schemas/AnswerRequests';
import BACKEND_URL from '../backend-path';

export async function createNewAnswerRequest(
	answerRequest: AnswerRequestSchemaInterface
) {
	const resp = await fetch(BACKEND_URL + '/db/answer-requests', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(answerRequest),
	});
	return resp;
}
