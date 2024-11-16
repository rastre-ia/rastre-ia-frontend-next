import mongoose, { Model, Schema } from 'mongoose';

export enum ActivityTypeEnum {
	ANSWER_REQUEST = 'answer_request',
	CREATE_REPORT = 'create_report',
	REGISTER_STOLEN_ITEM = 'register_stolen_item',
	OTHER = 'other',
}

export interface UserActivitiesInterface {
	_id?: Schema.Types.ObjectId | string;
	userId: Schema.Types.ObjectId | string;
	activityType: ActivityTypeEnum;
	requestId?: Schema.Types.ObjectId | string;
	reportId?: Schema.Types.ObjectId | string;
	stolenItemId?: Schema.Types.ObjectId | string;
	extraData?: String;

	createdAt?: Date;
	updatedAt?: Date;
}

const userActivitiesSchema = new Schema<UserActivitiesInterface>({
	userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
	activityType: {
		type: String,
		enum: Object.values(ActivityTypeEnum),
		required: true,
		default: ActivityTypeEnum.ANSWER_REQUEST,
	},
	requestId: { type: Schema.Types.ObjectId, ref: 'AnswerRequests' },
	reportId: { type: Schema.Types.ObjectId, ref: 'Reports' },
	stolenItemId: { type: Schema.Types.ObjectId, ref: 'StolenItems' },
	extraData: { type: String },

	createdAt: { type: Date, default: () => Date.now(), immutable: true },
	updatedAt: { type: Date, default: () => Date.now() },
});

userActivitiesSchema.pre('validate', function (next) {
	if (
		this.activityType === ActivityTypeEnum.ANSWER_REQUEST &&
		!this.requestId
	)
		next(new Error('requestId is required'));

	if (this.activityType === ActivityTypeEnum.CREATE_REPORT && !this.reportId)
		next(new Error('reportId is required'));

	if (
		this.activityType === ActivityTypeEnum.REGISTER_STOLEN_ITEM &&
		!this.stolenItemId
	)
		next(new Error('stolenItemId is required'));

	if (this.activityType === ActivityTypeEnum.OTHER && !this.extraData)
		next(new Error('data is required for other activities'));

	next();
});

userActivitiesSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

const UserActivities =
	mongoose.models.UserActivities ||
	mongoose.model<UserActivitiesInterface>(
		'UserActivities',
		userActivitiesSchema
	);

export default UserActivities as Model<UserActivitiesInterface>;
