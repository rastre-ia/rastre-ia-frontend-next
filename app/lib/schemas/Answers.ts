import mongoose, { Schema } from 'mongoose';

export interface AnswersSchemaInterface {
	_id?: string;

	answerRequestId: Schema.Types.ObjectId | string;
	userId: Schema.Types.ObjectId | string;

	content: string;

	createdAt?: Date;
	updatedAt?: Date;
}

const answersSchema = new Schema<AnswersSchemaInterface>({
	answerRequestId: {
		type: Schema.Types.ObjectId,
		ref: 'AnswerRequests',
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'Users',
		required: true,
	},
	content: { type: String, required: true },

	createdAt: { type: Date, default: () => Date.now(), immutable: true },
	updatedAt: { type: Date, default: () => Date.now() },
});

answersSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

const Answers =
	mongoose.models.Answers || mongoose.model('Answers', answersSchema);

export default Answers;
