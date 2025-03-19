import { getMarkdown } from '@/app/lib/embeddings-api';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

const embeddings_url = process.env.NEXT_PUBLIC_EMBEDDING_ENDPOINT_URL || '';
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
		const formData = await req.formData();
		const file = formData.get('file') as File | null;

		if (!file) {
			return NextResponse.json(
				{ error: 'O arquivo é obrigatório' },
				{ status: 400 }
			);
		}

		const markdownData = await getMarkdown(embeddings_url, file);
		return NextResponse.json(markdownData, { status: 200 });
	} catch (error) {
		console.error('Erro ao processar Markdown:', error);
		return NextResponse.json(
			{ error: 'Erro interno do servidor' },
			{ status: 500 }
		);
	}
}
