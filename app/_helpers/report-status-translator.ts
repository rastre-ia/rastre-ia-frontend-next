import { ReportStatusEnum } from '../lib/schemas/Reports';

export const validReportStatusTranslated = [
	{ value: ReportStatusEnum.NOT_APPLICABLE, label: 'Não se aplica' },
	{ value: ReportStatusEnum.NOT_RESOLVED, label: 'Não resolvido' },
	{ value: ReportStatusEnum.PENDING, label: 'Pendente' },
	{ value: ReportStatusEnum.RESOLVED, label: 'Resolvido' },
];

export default function reportStatusTranslator(
	reportStatus: ReportStatusEnum
): string {
	switch (reportStatus) {
		case ReportStatusEnum.NOT_APPLICABLE:
			return validReportStatusTranslated[0].label;
		case ReportStatusEnum.NOT_RESOLVED:
			return validReportStatusTranslated[1].label;
		case ReportStatusEnum.PENDING:
			return validReportStatusTranslated[2].label;
		case ReportStatusEnum.RESOLVED:
			return validReportStatusTranslated[3].label;
		default:
			return validReportStatusTranslated[0].label;
	}
}
