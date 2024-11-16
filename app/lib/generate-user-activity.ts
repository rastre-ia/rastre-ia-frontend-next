import UserActivities, {
	UserActivitiesInterface,
} from './schemas/UserActivities';
import dbConnect from './mongodb';
import { ClientSession } from 'mongoose';

export default async function generateUserActivity(
	newActivity: UserActivitiesInterface,
	session: ClientSession
) {
	try {
		await UserActivities.create([newActivity], {
			session: session,
		});
	} catch (error) {
		console.error('Error creating user activity:', error);
		throw new Error('Error creating user activity');
	}
}
