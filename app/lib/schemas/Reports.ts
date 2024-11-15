import mongoose, { Schema } from 'mongoose';
import pointSchema from './helpers/PointSchema';
import chatSchema from './helpers/ChatSchema';

export enum ReportAssistanceNeededEnum {
	REQUIRE_ASSISTANCE = 'require_assistance',
	DONT_REQUIRE_ASSIST = 'dont_require_assist',
}

export enum ReportStatusEnum {
	PENDING = 'pending',
	RESOLVED = 'resolved',
	NOT_RESOLVED = 'not_resolved',
	NOT_APPLICABLE = 'not_applicable',
}

export enum ReportTypeEnum {
	STRANGE_ACTIVITY = 'strange_activity',
	TRAFFIC = 'traffic',
	PEACE_DISTURBANCE = 'peace_disturbance',
	PHYSICAL_ASSAULT = 'physical_assault',
	ROBBERY = 'robbery',
	OTHER = 'other',
}

export enum ReportSubmissionMethodEnum {
	AI_ASSISTANT = 'ai_assistant',
	FORMS = 'forms',
	OTHER = 'other',
}

const reportsSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },

	title: { type: String, required: true },
	location: { type: pointSchema, index: '2dsphere', required: true },
	description: { type: String, required: true },

	images: { type: [String] },

	status: {
		type: String,
		enum: Object.values(ReportStatusEnum),
		required: true,
		default: ReportStatusEnum.NOT_APPLICABLE,
	},

	assistanceNeeded: {
		type: String,
		enum: Object.values(ReportAssistanceNeededEnum),
		required: true,
		default: ReportAssistanceNeededEnum.DONT_REQUIRE_ASSIST,
	},

	type: {
		type: String,
		enum: Object.values(ReportTypeEnum),
		required: true,
		default: ReportTypeEnum.STRANGE_ACTIVITY,
	},

	submissionMethod: {
		type: String,
		enum: Object.values(ReportSubmissionMethodEnum),
		required: true,
		default: ReportSubmissionMethodEnum.AI_ASSISTANT,
	},

	chatHistory: { type: [chatSchema] },
	embeddings: { type: [Number], required: true },

	createdAt: { type: Date, default: () => Date.now(), immutable: true },
	updatedAt: { type: Date, default: () => Date.now() },
});

reportsSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

const Reports =
	mongoose.models.Reports || mongoose.model('Reports', reportsSchema);

export default Reports;
