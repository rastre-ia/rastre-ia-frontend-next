import { Schema } from 'mongoose';

export interface EmbeddedImageSchemaInterface {
	imageURL: string;
	embeddings: number[];
}

const embeddedImageSchema = new Schema<EmbeddedImageSchemaInterface>({
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
