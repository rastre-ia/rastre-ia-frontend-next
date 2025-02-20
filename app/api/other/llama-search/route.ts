import { NextResponse } from 'next/server';
import { getLlamaSearch } from '@/app/lib/embeddings-api';

// Define the POST function
export async function POST(
	req: Request
	// Using a more specific type
) {
	// Await params if necessary (currently unused, but keeping the structure)

	// Parse the request body
	const { query } = await req.json();

	// Check if the query parameter is present
	if (!query) {
		return NextResponse.json(
			{ message: 'Bad request: Missing query parameter' },
			{ status: 400 }
		);
	}

	try {
		// Perform the Llama search
		const searchResults = await getLlamaSearch(query);
		console.log(searchResults);

		// Return the search results
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
