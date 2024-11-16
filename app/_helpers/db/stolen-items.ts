import BACKEND_URL from '../backend-path';
import {
	StolenItemsSchemaInterface,
	StolenItemsStatusEnum,
} from '@/app/lib/schemas/StolenItems';

export async function registerNewStolenItem(
	stolenItem: StolenItemsSchemaInterface
) {
	const resp = await fetch(BACKEND_URL + '/db/stolen-items', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(stolenItem),
	});
	return resp;
}

export async function getStolenItemsStatus(
	idArray: string[] | undefined,
	headers: Headers
): Promise<{ id: string; status: StolenItemsStatusEnum }[]> {
	if (!idArray) return [];

	try {
		const params = `?ids=${idArray}`;

		const resp = await fetch(
			BACKEND_URL + '/db/stolen-items/status' + params,
			{
				headers: headers,
			}
		);
		if (!resp.ok) {
			return [];
		}

		const parsedResp = await resp.json();

		return parsedResp.statusArray;
	} catch (error) {
		console.error('Error getting stolen items:', error);
	}
	return [];
}
