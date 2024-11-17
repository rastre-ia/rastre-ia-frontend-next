import { NextResponse } from 'next/server';
import { auth } from '@/auth';  
import { getLlamaSearch } from '@/app/lib/embeddings-api';  

export const POST = auth(async function POST(req) {
	if (req.auth) {
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
	return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
});
