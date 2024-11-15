import { Schema } from 'mongoose';

export async function getUserObjectIdById(
	id: string
): Promise<Schema.Types.ObjectId> {
	const resp = await fetch(`/api/db/users/${id}`);
	const parsedResp = await resp.json();
	return parsedResp.user._id;
}
