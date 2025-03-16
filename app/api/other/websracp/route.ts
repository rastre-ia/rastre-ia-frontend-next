import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import { getWebscrap } from '@/app/lib/embeddings-api';
import { getImageEmbeddings } from '@/app/lib/embeddings-api';

export async function POST(req: NextRequest) {
	const session = await auth();

	if (session) {
		const { search_term } = await req.json();

		if (!search_term) {
			return NextResponse.json(
				{ message: 'Bad request: Missing search term' },
				{ status: 400 }
			);
		}

		try {
			const results = await getWebscrap(search_term);

			if (!Array.isArray(results)) {
				console.error('Invalid results format:', results);
				throw new Error('Invalid results format: Expected an array');
			}

			const resultsWithEmbeddings = await Promise.all(
				results.map(async (result) => {
					try {
						const img_embedding = await getImageEmbeddings(
							result.img_url
						);
						return {
							...result,
							img_embedding,
						};
					} catch (error) {
						console.error(
							`Error embedding image for ${result.title}:`,
							error
						);
						return {
							...result,
							img_embedding: null,
						};
					}
				})
			);
			console.log('Results with Embeddings:', resultsWithEmbeddings);
			return NextResponse.json({
				results: resultsWithEmbeddings,
			});
		} catch (error: unknown) {
			console.error('Error fetching status:', error);
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error';
			return NextResponse.json(
				{ message: 'Error fetching status', error: errorMessage },
				{ status: 500 }
			);
		}
	}
}
