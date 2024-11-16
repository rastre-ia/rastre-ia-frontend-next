import mongoose, { Schema } from 'mongoose';
import pointSchema, { PointSchemaInterface } from './helpers/PointSchema';
import embeddedImageSchema, {
	EmbeddedImageSchemaInterface,
} from './helpers/EmbeddedImageSchema';

export interface StolenItemsSchemaInterface {
	userId: Schema.Types.ObjectId | string;
	object: string;
	objectDescription: string;
	images: EmbeddedImageSchemaInterface[];
	location: PointSchemaInterface;
	eventDate: Date;
	eventDescription: string;
	suspectCharacteristics: string;
	embeddings: number[];
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

	embeddings: { type: [Number], required: true },

	createdAt: { type: Date, default: () => Date.now(), immutable: true },
	updatedAt: { type: Date, default: () => Date.now() },
});

StolenItemsSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

const StolenItems =
	mongoose.models.StolenItems ||
	mongoose.model<StolenItemsSchemaInterface>(
		'StolenItems',
		StolenItemsSchema
	);

export default StolenItems;
