import { UserActivitiesInterface } from '@/app/lib/schemas/UserActivities';
import BACKEND_URL from '../backend-path';

export async function findUserActivitiesByUserId(
	userId: string,
	headers?: Headers
): Promise<UserActivitiesInterface[]> {
	const resp = await fetch(BACKEND_URL + `/db/user-activities?id=${userId}`, {
		headers: headers,
	});

	if (!resp.ok) {
		return [];
	}
	const parsedResp = await resp.json();

	return parsedResp.userActivities;
}

// export async function getUserActivityById(
//     id: string
// ): Promise<Schema.Types.ObjectId> {
//     const resp = await fetch(`/api/db/user-activities/${id}`);
//     const parsedResp = await resp.json();
//     return parsedResp.userActivity;
// }
