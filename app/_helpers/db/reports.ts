import {
	ReportSchemaInterface,
	ReportStatusEnum,
	ReportTypeEnum,
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

export async function getReports(
	perPage: number = 12,
	page: number = 1,
	status?: ReportStatusEnum | null,
	type?: ReportTypeEnum | null
): Promise<{ reports: ReportSchemaInterface[]; pageCount: number }> {
	const pageMinusOne = page - 1;

	const params = new URLSearchParams();
	params.append('per_page', perPage.toString());
	params.append('page', pageMinusOne.toString());
	if (status) params.append('status', status);
	if (type) params.append('type', type);

	const resp = await fetch(BACKEND_URL + '/db/reports?' + params.toString(), {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
	if (!resp.ok) {
		console.error('Error: ', resp.statusText);
	}

	const parsedResp = await resp.json();
	return parsedResp;
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
