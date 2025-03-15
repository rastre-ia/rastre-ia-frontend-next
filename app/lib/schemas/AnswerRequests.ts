import mongoose, { Schema } from 'mongoose'; // Explicitly import `Document` for type safety
import {
	AnswerRequestEventTypeEnum,
	AnswerRequestPriorityEnum,
	AnswerRequestStatusEnum,
} from './helpers/AnswerRequestsEnums';
import pointSchema, { PointSchemaInterface } from './helpers/PointSchema';

export interface AnswerRequestSchemaInterface {
	_id?: Schema.Types.ObjectId | string;

	policeStationId: Schema.Types.ObjectId | string;
	location: PointSchemaInterface;
	requestRadius: number;
	usersRequested: Schema.Types.ObjectId[] | string[];
	priority: AnswerRequestPriorityEnum;

	title: string;
	message: string;
	status: AnswerRequestStatusEnum;

	eventType: AnswerRequestEventTypeEnum;
	reportId?: Schema.Types.ObjectId | string;
	stolenItemId?: Schema.Types.ObjectId | string;

	createdAt?: Date;
	updatedAt?: Date;
}

const answerRequestsSchema = new Schema<AnswerRequestSchemaInterface>({
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
	usersRequested: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Users',
		},
	],

	priority: {
		type: String,
		enum: Object.values(AnswerRequestPriorityEnum),
		required: true,
		default: AnswerRequestPriorityEnum.MEDIUM,
	},

	title: { type: String, required: true },
	message: { type: String, required: true },

	status: {
		type: String,
		enum: Object.values(AnswerRequestStatusEnum),
		required: true,
		default: AnswerRequestStatusEnum.ON_GOING,
	},

	eventType: {
		type: String,
		enum: Object.values(AnswerRequestEventTypeEnum),
		required: true,
		default: AnswerRequestEventTypeEnum.OTHER,
	},
	reportId: { type: Schema.Types.ObjectId, ref: 'Reports' },
	stolenItemId: { type: Schema.Types.ObjectId, ref: 'StolenItems' },

	createdAt: { type: Date, default: () => Date.now(), immutable: true },
	updatedAt: { type: Date, default: () => Date.now() },
});

answerRequestsSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

const AnswerRequests =
	mongoose.models.AnswerRequests ||
	mongoose.model<AnswerRequestSchemaInterface>(
		'AnswerRequests',
		answerRequestsSchema
	);

export default AnswerRequests;
