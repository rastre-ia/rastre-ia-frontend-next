import { getNFE } from '@/app/lib/embeddings-api';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const session = await auth();
	if (!session) {
		console.log('Usuário não autenticado.');
		return NextResponse.json(
			{ message: 'Not authenticated' },
			{ status: 401 }
		);
	}

	try {
		const body = await req.json();
		const { chave_acesso } = body;

		if (!chave_acesso) {
			return NextResponse.json(
				{ error: 'Chave de acesso é obrigatória' },
				{ status: 400 }
			);
		}

		const nfeData = await getNFE(chave_acesso);
		return NextResponse.json(nfeData, { status: 200 });
	} catch (error) {
		console.error('Erro ao buscar NF-e:', error);
		return NextResponse.json(
			{ error: 'Erro interno do servidor' },
			{ status: 500 }
		);
	}
}
