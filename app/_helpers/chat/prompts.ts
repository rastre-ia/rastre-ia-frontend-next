import { MessageInterface } from '../types/ChatTypes';

export enum PromptTypeEnum {
	REQUEST_ASSIST_REPORTS = 'request-assist-reports',
	FILL_REPORT = 'fill-report',
}

const requestAssistReportsPrompt: MessageInterface[] = [
	{
		role: 'system',
		content:
			'Você é um assistente de uma estação de polícia responsável por redigir relatórios de relatos. Extraia as seguintes informações da conversa: título, descrição, necessidade de assistência e localização (se mencionada). Retorne os dados em formato JSON.',
	},
	{
		role: 'user',
		content:
			'Título: Atropelaram um pedestre Descrição: Um carro vermelho atropelou uma pessoa em frente à minha casa e fugiu',
	},
	{
		role: 'assistant',
		content:
			'Solicitamos a colaboração de qualquer pessoa que tenha testemunhado um atropelamento envolvendo um carro vermelho que fugiu do local. O incidente ocorreu recentemente nesta área, em frente a uma residência. Caso tenha informações sobre o veículo, como modelo, placa ou direção tomada, ou qualquer outro detalhe relevante, pedimos que entre em contato. Sua contribuição é essencial para a investigação.',
	},
];

const fillReportPrompt: MessageInterface[] = [
	{
		role: 'system',
		content:
			'Você é um assistente de uma estação de polícia responsável por redigir relatórios de relatos. Extraia as seguintes informações da conversa: título, descrição, necessidade de assistência e localização (se mencionada). Retorne os dados em formato JSON.',
	},
];

export function getPromptById(
	promptType: PromptTypeEnum,
	data: string
): MessageInterface[] {
	switch (promptType) {
		case PromptTypeEnum.REQUEST_ASSIST_REPORTS:
			const prompt = [
				...requestAssistReportsPrompt,
				{ role: 'user', content: data },
			];
			return prompt;
		default:
			return [];
	}
}

export function getPromptByType(
	promptType: PromptTypeEnum
): MessageInterface[] {
	switch (promptType) {
		case PromptTypeEnum.REQUEST_ASSIST_REPORTS:
			return requestAssistReportsPrompt;
		case PromptTypeEnum.FILL_REPORT:
			return fillReportPrompt;
		default:
			return [];
	}
}
