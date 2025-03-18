import mongoose, { Schema } from 'mongoose';
import embeddedImageSchema, {
	EmbeddedImageSchemaInterface,
} from './helpers/EmbeddedImageSchema';
import pointSchema, { PointSchemaInterface } from './helpers/PointSchema';

export enum StolenItemsStatusEnum {
	PENDING = 'pending',
	ON_INVESTIGATION = 'on_investigation',
	SOLVED_NOT_RECUPERATED = 'solved_not_recuperated',
	SOLVED_RECUPERATED = 'solved_recuperated',
}

export interface StolenItemsSchemaInterface {
	_id?: Schema.Types.ObjectId;

	userId: Schema.Types.ObjectId | string;
	object: string;
	objectDescription: string;
	images: EmbeddedImageSchemaInterface[];
	location: PointSchemaInterface;
	eventDate: Date;
	eventDescription: string;
	suspectCharacteristics: string;
	embeddings: number[];

	status?: StolenItemsStatusEnum;
	createdAt?: Date;
	updatedAt?: Date;
}

const StolenItemsSchema = new Schema<StolenItemsSchemaInterface>({
	userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },

	object: { type: String, required: true },
	objectDescription: { type: String, required: true },

	images: { type: [embeddedImageSchema] },

	location: { type: pointSchema, index: '2dsphere', required: true },
	eventDate: { type: Date, required: true },
	eventDescription: { type: String, required: true },
	suspectCharacteristics: { type: String },

	status: {
		type: String,
		enum: Object.values(StolenItemsStatusEnum),
		required: true,
		default: StolenItemsStatusEnum.PENDING,
	},

	embeddings: { type: [Number], required: true },

	createdAt: { type: Date, default: () => Date.now(), immutable: true },
	updatedAt: { type: Date, default: () => Date.now() },
});

StolenItemsSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

const StolenItems =
	mongoose.models?.StolenItems ||
	mongoose.model('StolenItems', StolenItemsSchema);
export default StolenItems;
