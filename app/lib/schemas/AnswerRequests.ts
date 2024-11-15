import mongoose, { Schema } from 'mongoose';
import pointSchema from './helpers/PointSchema';

export enum AnswerRequestStatusEnum {
	ON_GOING = 'on_going',
	CLOSED = 'closed',
}

export enum AnswerRequestPriorityEnum {
	LOW = 'low',
	MEDIUM = 'medium',
	HIGH = 'high',
}

const answerRequestsSchema = new Schema({
	policeStationId: {
		type: Schema.Types.ObjectId,
		ref: 'PoliceStations',
		required: true,
	},

	location: {
		type: pointSchema,
		index: '2dsphere',
		required: true,
	},
	requestRadius: {
		type: Number,
		required: true,
		default: 1000, // 1000 meters
		min: [1, 'The request radius must be greater than 1 meter'],
	},

	priority: {
		type: String,
		enum: Object.values(AnswerRequestPriorityEnum),
		required: true,
		default: AnswerRequestPriorityEnum.MEDIUM,
	},
	message: { type: String, required: true },

	status: {
		type: String,
		enum: Object.values(AnswerRequestStatusEnum),
		required: true,
		default: AnswerRequestStatusEnum.ON_GOING,
	},

	createdAt: { type: Date, default: () => Date.now(), immutable: true },
	updatedAt: { type: Date, default: () => Date.now() },
});

answerRequestsSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

const AnswerRequests =
	mongoose.models.AnswerRequests ||
	mongoose.model('AnswerRequests', answerRequestsSchema);

export default AnswerRequests;
