import { ReportSchemaInterface } from '@/app/lib/schemas/Reports';
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
