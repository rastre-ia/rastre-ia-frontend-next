import { AnswerRequestPriorityEnum } from '../lib/schemas/helpers/AnswerRequestsEnums';

export default function calculateAnswerExperience(
	answerPriority: AnswerRequestPriorityEnum
): number {
	switch (answerPriority) {
		case AnswerRequestPriorityEnum.HIGH:
			return 75;
		case AnswerRequestPriorityEnum.MEDIUM:
			return 35;
		case AnswerRequestPriorityEnum.LOW:
			return 10;
		default:
			return 0;
	}
}
