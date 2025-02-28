// HelpWantedRequestServer.tsx
'use server';

import { createNewAnswer } from '@/app/_helpers/db/answer';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function handleSubmitResponse(
	requestId: string,
	userId: string,
	responseMessage: string,
	myHeaders: Headers
) {
	await createNewAnswer(
		{
			answerRequestId: requestId,
			userId: userId,
			content: responseMessage,
		},
		myHeaders
	);

	revalidatePath('help-wanted');
	redirect('/help-wanted');
}
