import BACKEND_URL from '../backend-path';
import { StolenItemsSchemaInterface } from '@/app/lib/schemas/StolenItems';

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
