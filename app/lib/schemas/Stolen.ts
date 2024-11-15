import mongoose, { Schema } from 'mongoose';
import pointSchema from './helpers/PointSchema';
import embeddedImageSchema from './helpers/EmbeddedImageSchema';

const StolenItemsSchema = new Schema({
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
    mongoose.model('StolenItems', StolenItemsSchema);

export default StolenItems;