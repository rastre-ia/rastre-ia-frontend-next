import {
	StolenItemsSchemaInterface,
	StolenItemsStatusEnum,
} from '@/app/lib/schemas/StolenItems';
import BACKEND_URL from '../backend-path';

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

		console.log('getStolenItemsStatus', resp);

		if (!resp.ok) {
			return [];
		}

		const contentType = resp.headers.get('content-type');
		if (!contentType || !contentType.includes('application/json')) {
			console.error('Received non-JSON response:', await resp.text());
			return [];
		}

		const parsedResp = await resp.json();

		return parsedResp.statusArray || [];
	} catch (error) {
		console.error('Error getting stolen items:', error);
	}
	return [];
}
