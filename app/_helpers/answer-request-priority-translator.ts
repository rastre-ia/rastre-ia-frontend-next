import { AnswerRequestPriorityEnum } from '../lib/schemas/helpers/AnswerRequestsEnums';

export const validAnswerRequestPriorityTranslated = [
	{ value: AnswerRequestPriorityEnum.HIGH, label: 'Alta' },
	{ value: AnswerRequestPriorityEnum.MEDIUM, label: 'Média' },
	{ value: AnswerRequestPriorityEnum.LOW, label: 'Baixa' },
];

export default function answerRequestPriorityTranslator(
	requestPriority: AnswerRequestPriorityEnum
): string {
	switch (requestPriority) {
		case AnswerRequestPriorityEnum.HIGH:
			return validAnswerRequestPriorityTranslated[0].label;
		case AnswerRequestPriorityEnum.MEDIUM:
			return validAnswerRequestPriorityTranslated[1].label;
		case AnswerRequestPriorityEnum.LOW:
			return validAnswerRequestPriorityTranslated[2].label;
		default:
			return validAnswerRequestPriorityTranslated[1].label;
	}
}
