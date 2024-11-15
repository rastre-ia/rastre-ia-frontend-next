import { Schema } from 'mongoose';
const pointSchema = new Schema({
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
