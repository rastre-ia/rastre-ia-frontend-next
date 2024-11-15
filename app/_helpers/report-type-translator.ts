import { ReportTypeEnum } from '../lib/schemas/Reports';

export const validReportTypesTranslated = [
	{ value: ReportTypeEnum.STRANGE_ACTIVITY, label: 'Atividade Suspeita' },
	{ value: ReportTypeEnum.TRAFFIC, label: 'Evento de Trânsito' },
	{ value: ReportTypeEnum.PEACE_DISTURBANCE, label: 'Distúrbio de Paz' },
	{ value: ReportTypeEnum.PHYSICAL_ASSAULT, label: 'Assalto Físico' },
	{ value: ReportTypeEnum.ROBBERY, label: 'Roubo' },
	{ value: ReportTypeEnum.OTHER, label: 'Outro' },
];

export default function reportTypeTranslator(
	reportType: ReportTypeEnum
): string {
	switch (reportType) {
		case ReportTypeEnum.STRANGE_ACTIVITY:
			return validReportTypesTranslated[0].label;
		case ReportTypeEnum.TRAFFIC:
			return validReportTypesTranslated[1].label;
		case ReportTypeEnum.PEACE_DISTURBANCE:
			return validReportTypesTranslated[2].label;
		case ReportTypeEnum.PHYSICAL_ASSAULT:
			return validReportTypesTranslated[3].label;
		case ReportTypeEnum.ROBBERY:
			return validReportTypesTranslated[4].label;
		case ReportTypeEnum.OTHER:
		default:
			return validReportTypesTranslated[5].label;
	}
}
