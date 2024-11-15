import { Schema } from 'mongoose';

export enum MessageTypeEnum {
	USER = 'user',
	ASSISTANT = 'assistant',
	SYSTEM = 'system',
	OTHER = 'other',
}

export interface ChatSchemaInterface {
	activityType: MessageTypeEnum;
	content: string;
	createdAt: Date;
}

const chatSchema = new Schema({
	activityType: {
		type: String,
		enum: Object.values(MessageTypeEnum),
		required: true,
		default: MessageTypeEnum.USER,
		immutable: true,
	},
	content: { type: String, required: true, immutable: true },
	createdAt: { type: Date, default: () => Date.now(), immutable: true },
});

export default chatSchema;
