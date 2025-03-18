import {
	getImageEmbeddings,
	getTextEmbeddings,
} from '@/app/lib/embeddings-api';
import generateUserActivity from '@/app/lib/generate-user-activity';
import dbConnect from '@/app/lib/mongodb';
import StolenItems, {
	StolenItemsSchemaInterface,
} from '@/app/lib/schemas/StolenItems';
import { ActivityTypeEnum } from '@/app/lib/schemas/UserActivities';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		console.log('Verificando autenticação...');
		const session = await auth();
		if (!session) {
			console.log('Usuário não autenticado.');
			return NextResponse.json(
				{ message: 'Not authenticated' },
				{ status: 401 }
			);
		}

		console.log('Validando dados da requisição...');
		let requestData;
		try {
			requestData = await req.json();
		} catch (error) {
			console.error('Erro ao fazer parse do JSON:', error);
			return NextResponse.json(
				{ message: 'Formato de JSON inválido' },
				{ status: 400 }
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
		} = requestData as StolenItemsSchemaInterface;
		if (
			!object ||
			!objectDescription ||
			!images ||
			!location ||
			!eventDate
		) {
			console.log('Dados inválidos ou incompletos.');
			return NextResponse.json(
				{ message: 'Dados inválidos ou incompletos' },
				{ status: 400 }
			);
		}

		if (userId !== session.user._id) {
			console.log('Usuário não autorizado.');
			return NextResponse.json(
				{ message: 'Unauthorized to create report' },
				{ status: 401 }
			);
		}

		console.log('Criando embeddings de texto...');
		const textForEmbeddings = `Data: ${eventDate} Tipo do objeto: ${object} Descrição do objeto: ${objectDescription} Descrição do evento: ${eventDescription} Descrição do suspeito: ${suspectCharacteristics}`;
		const textEmbeddings = await getTextEmbeddings(textForEmbeddings);
		console.log('Embeddings de texto criados:', textEmbeddings);

		console.log('Criando embeddings de imagem...');
		const imageEmbeddings = await Promise.all(
			images.map(async (image) => ({
				imageURL: image.imageURL,
				embeddings: await getImageEmbeddings(image.imageURL),
			}))
		);
		console.log('Embeddings de imagem criados:', imageEmbeddings);

		console.log('Conectando ao MongoDB...');
		await dbConnect();

		console.log('Iniciando sessão do MongoDB...');
		const mongoSession = await StolenItems.startSession();
		mongoSession.startTransaction();

		console.log('Criando registro de item roubado...');
		const stolenItemRegistration = await StolenItems.create(
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
		console.log('Registro de item roubado criado:', stolenItemRegistration);

		console.log('Gerando atividade do usuário...');
		await generateUserActivity(
			{
				userId,
				activityType: ActivityTypeEnum.REGISTER_STOLEN_ITEM,
				stolenItemId: stolenItemRegistration[0]._id,
			},
			mongoSession
		);
		console.log('Atividade do usuário gerada com sucesso.');

		console.log('Finalizando sessão do MongoDB...');
		await mongoSession.commitTransaction();
		mongoSession.endSession();

		console.log('Retornando resposta...');
		const res = NextResponse.json({
			message: 'Report created successfully',
		});
		res.headers.set('Access-Control-Allow-Origin', '*');
		res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		res.headers.set(
			'Access-Control-Allow-Headers',
			'Content-Type, Authorization'
		);
		return res;
	} catch (error: unknown) {
		console.error('Erro ao processar requisição:', error);
		return NextResponse.json(
			{
				message: 'Internal server error',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}

export async function GET(req: NextRequest) {
	try {
		console.log('Verificando autenticação...');
		const session = await auth();
		if (!session) {
			console.log('Usuário não autenticado.');
			return NextResponse.json(
				{ message: 'Not authenticated' },
				{ status: 401 }
			);
		}

		console.log('Conectando ao MongoDB...');
		await dbConnect();

		console.log('Obtendo parâmetros da URL...');
		const { searchParams } = new URL(req.url);
		const perPage = parseInt(searchParams.get('per_page') || '12', 10);
		const page = parseInt(searchParams.get('page') || '0', 10);
		const status = searchParams.get('status'); // Se precisar filtrar por status

		console.log('Buscando itens roubados...');
		const stolenItemsQuery: any = {};
		if (status) stolenItemsQuery.status = status;

		const stolenItems = await StolenItems.find(stolenItemsQuery)
			.skip(page * perPage)
			.limit(perPage)
			.lean();

		const totalItems = await StolenItems.countDocuments(stolenItemsQuery);
		const pageCount = Math.ceil(totalItems / perPage);

		console.log('Retornando itens roubados...');
		return NextResponse.json({ stolenItems, pageCount });
	} catch (error) {
		console.error('Erro ao buscar itens roubados:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
