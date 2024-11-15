import { Schema } from 'mongoose';

export interface PointSchemaInterface {
	type: string;
	coordinates: [number, number];
}

const pointSchema = new Schema<PointSchemaInterface>({
	type: {
		type: String,
		enum: ['Point'],
		required: true,
	},
	// Coordinates must be stored in [longitude, latitude] order
	coordinates: {
		type: [Number],
		required: true,
	},
});

export default pointSchema;
