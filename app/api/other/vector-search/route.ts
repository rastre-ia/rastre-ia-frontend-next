import {
	getTextEmbeddings,
	getVectorSearchResults,
} from '@/app/lib/embeddings-api';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const session = await auth();
	if (session) {
		const { searchQuery, collection, numCandidates, limit } =
			await req.json();

		if (!searchQuery || !collection)
			return NextResponse.json(
				{ message: 'Bad request' },
				{ status: 400 }
			);

		try {
			const embeddingsData = await getTextEmbeddings(searchQuery);

			const results = await getVectorSearchResults(
				embeddingsData,
				collection,
				numCandidates,
				limit
			);

			return NextResponse.json({
				results: results,
			});
		} catch (error) {
			console.error('Error fetching status:', error);
			return NextResponse.json(
				{ message: 'Error fetching status', error },

				{ status: 500 }
			);
		}
	}
	return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
}
