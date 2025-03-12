import StolenItems, {
	StolenItemsSchemaInterface,
} from '@/app/lib/schemas/StolenItems';
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import generateUserActivity from '@/app/lib/generate-user-activity';
import { ActivityTypeEnum } from '@/app/lib/schemas/UserActivities';
import {
	getImageEmbeddings,
	getTextEmbeddings,
} from '@/app/lib/embeddings-api';
import { EmbeddedImageSchemaInterface } from '@/app/lib/schemas/helpers/EmbeddedImageSchema';
import dbConnect from '@/app/lib/mongodb';

export async function OPTIONS() {
	const res = new NextResponse(null, { status: 204 });

	res.headers.set('Access-Control-Allow-Origin', '*');
	res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.headers.set(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization'
	);

	return res;
}

export async function POST(req: NextRequest) {
	const session = await auth();
	if (!session) {
		return NextResponse.json(
			{ message: 'Not authenticated' },
			{ status: 401 }
		);
	}

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

	if (userId !== session.user._id) {
		return NextResponse.json(
			{ message: 'Unauthorized to create report' },
			{ status: 401 }
		);
	}

	let textEmbeddings: number[] = [];
	let imageEmbeddings: EmbeddedImageSchemaInterface[] = [];

	try {
		const textForEmbeddings = `Data: ${eventDate} Tipo do objeto: ${object} Descrição do objeto: ${objectDescription} Descrição do evento: ${eventDescription} Descrição do suspeito: ${suspectCharacteristics}`;

		textEmbeddings = await getTextEmbeddings(textForEmbeddings);
	} catch (error) {
		console.error('Error creating text embeddings:', error);
		return NextResponse.json(
			{ message: 'Error creating text embeddings' },
			{ status: 500 }
		);
	}

	try {
		imageEmbeddings = await Promise.all(
			images.map(async (image) => ({
				imageURL: image.imageURL,
				embeddings: await getImageEmbeddings(image.imageURL),
			}))
		);
	} catch (error) {
		console.error('Error creating image embeddings:', error);
		return NextResponse.json(
			{ message: 'Error creating image embeddings' },
			{ status: 500 }
		);
	}

	try {
		await dbConnect();
		const mongoSession = await StolenItems.startSession();

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
				{ session: mongoSession }
			);

		await generateUserActivity(
			{
				userId,
				activityType: ActivityTypeEnum.REGISTER_STOLEN_ITEM,
				stolenItemId: stolenItemRegistration[0]._id,
			},
			mongoSession
		);

		await mongoSession.endSession();

		const res = NextResponse.json({
			message: 'Report created successfully',
		});

		// Adicionando os cabeçalhos CORSwd
		res.headers.set('Access-Control-Allow-Origin', '*');
		res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		res.headers.set(
			'Access-Control-Allow-Headers',
			'Content-Type, Authorization'
		);

		return res;
	} catch (error) {
		console.error('Error creating report:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
