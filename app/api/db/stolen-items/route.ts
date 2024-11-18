import StolenItems, {
	StolenItemsSchemaInterface,
} from '@/app/lib/schemas/StolenItems';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import generateUserActivity from '@/app/lib/generate-user-activity';
import { ActivityTypeEnum } from '@/app/lib/schemas/UserActivities';
import {
	getImageEmbeddings,
	getTextEmbeddings,
} from '@/app/lib/embeddings-api';
import { EmbeddedImageSchemaInterface } from '@/app/lib/schemas/helpers/EmbeddedImageSchema';

// Route to create a new stolen item report
// Uses a transaction to ensure that the user activity is created
export const POST = auth(async function POST(req) {
	if (req.auth) {
		const {
			userId,
			object,
			objectDescription,
			images,
			location,
			eventDate,
			eventDescription,
			suspectCharacteristics,
		} = (await req.json()) as StolenItemsSchemaInterface;

		if ((userId as string) !== req.auth.user._id)
			return NextResponse.json(
				{ message: 'Unauthorized to create report' },
				{ status: 401 }
			);

		let textEmbeddings: number[] = [];
		const imageEmbeddings: EmbeddedImageSchemaInterface[] = [];

		try {
			const textForEmbeddings = `Data: ${eventDate} Tipo do objeto: ${object} Descrição do objeto: ${objectDescription} Descrição do evento: ${eventDescription} Descrição do suspeito: ${suspectCharacteristics}`;

			textEmbeddings = await getTextEmbeddings(textForEmbeddings);
		} catch (error) {
			console.error('Error creating text embeddings:', error);
			return NextResponse.json(
				{ message: 'Error creating text embeddings', error },

				{ status: 500 }
			);
		}

		try {
			for (const image of images) {
				const embeddings = await getImageEmbeddings(image.imageURL);
				imageEmbeddings.push({ imageURL: image.imageURL, embeddings });
			}
		} catch (error) {
			console.error('Error creating image embeddings:', error);
			return NextResponse.json(
				{ message: 'Error creating image embeddings', error },

				{ status: 500 }
			);
		}

		try {
			const session = await StolenItems.startSession();

			const stolenItemRegistration =
				await StolenItems.create<StolenItemsSchemaInterface>(
					[
						{
							userId,
							object,
							objectDescription,
							images: imageEmbeddings,
							location,
							eventDate,
							eventDescription,
							suspectCharacteristics,
							embeddings: textEmbeddings,
						},
					],
					{ session: session }
				);

			await generateUserActivity(
				{
					userId,
					activityType: ActivityTypeEnum.REGISTER_STOLEN_ITEM,
					stolenItemId: stolenItemRegistration[0]._id,
				},
				session
			);

			session.endSession();

			return NextResponse.json({
				message: 'Report created successfully',
			});
		} catch (error) {
			console.error('Error creating report:', error);
			return NextResponse.json(
				{ message: 'Error creating report', error },

				{ status: 500 }
			);
		}
	}
	return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
});
