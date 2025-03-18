import { getLlamaSearch } from '@/app/lib/embeddings-api';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	console.log('Verificando autenticação...');
	const session = await auth();
	if (!session) {
		console.log('Usuário não autenticado.');
		return NextResponse.json(
			{ message: 'Not authenticated' },
			{ status: 401 }
		);
	}

	const { query } = await req.json();

	if (!query) {
		return NextResponse.json(
			{ message: 'Bad request: Missing query parameter' },
			{ status: 400 }
		);
	}

	try {
		const searchResults = await getLlamaSearch(query);
		console.log(searchResults);
		return NextResponse.json({
			results: searchResults,
		});
	} catch (error) {
		console.error('Error during Llama search:', error);
		return NextResponse.json(
			{ message: 'Error fetching search results', error },
			{ status: 500 }
		);
	}
}
