import { UsersSchema } from '@/app/lib/schemas/Users';
import { Schema } from 'mongoose';
import BACKEND_URL from '../backend-path';

export async function getUserObjectIdById(
	id: string
): Promise<Schema.Types.ObjectId> {
	const resp = await fetch(BACKEND_URL + `/db/users/${id}`);
	const parsedResp = await resp.json();
	return parsedResp.user._id;
}

export interface GetUsersInRadiusResponse {
	users: UsersSchema[];
	total: number;
}

export async function getUsersInRadius(
	longitude: number,
	latitude: number,
	radius: number
): Promise<GetUsersInRadiusResponse> {
	const resp = await fetch(
		BACKEND_URL +
			`/db/users?lat=${latitude}&lon=${longitude}&radius=${radius}`
	);
	const parsedResp = await resp.json();
	return parsedResp;
}
