import mongoose, { Schema } from 'mongoose';

const policeStationsSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	passwordHash: { type: String, required: true },

	createdAt: { type: Date, default: () => Date.now(), immutable: true },
	updatedAt: { type: Date, default: () => Date.now() },
});

policeStationsSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

const PoliceStations =
	mongoose.models.PoliceStations ||
	mongoose.model('PoliceStations', policeStationsSchema);

export default PoliceStations;
