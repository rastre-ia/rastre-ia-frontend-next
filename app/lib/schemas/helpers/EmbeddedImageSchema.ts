import { Schema } from 'mongoose';

const embeddedImageSchema = new Schema({
	imageURL: {
		type: String,
		required: true,
	},
	embeddings: {
		type: [Number],
		required: true,
	},
});

export default embeddedImageSchema;
