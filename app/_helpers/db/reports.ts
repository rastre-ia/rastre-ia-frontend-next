import {
	ReportSchemaInterface,
	ReportStatusEnum,
} from '@/app/lib/schemas/Reports';
import BACKEND_URL from '../backend-path';

export async function createNewReport(report: ReportSchemaInterface) {
	const resp = await fetch(BACKEND_URL + '/db/reports', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(report),
	});
	return resp;
}

export async function getReportsStatus(
	idArray: string[] | undefined,
	headers: Headers
): Promise<{ id: string; status: ReportStatusEnum }[]> {
	if (!idArray) return [];

	try {
		const params = `?ids=${idArray}`;

		const resp = await fetch(BACKEND_URL + '/db/reports/status' + params, {
			headers: headers,
		});
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
