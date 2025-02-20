import { NextResponse } from 'next/server';
// import Reports, {
// 	ReportAssistanceNeededEnum,
// 	ReportSchemaInterface,
// 	ReportStatusEnum,
// } from '@/app/lib/schemas/Reports';
// import generateUserActivity from '@/app/lib/generate-user-activity';
// import { ActivityTypeEnum } from '@/app/lib/schemas/UserActivities';
// import dbConnect from '@/app/lib/mongodb';
// import RolesEnum from '@/app/lib/schemas/helpers/RolesEnum';
import {
	getTextEmbeddings,
	getVectorSearchResults,
} from '@/app/lib/embeddings-api';

// Define the POST function
export async function POST(req: Request) {
	// Check if the request is authenticated
	const isAuthenticated = req.headers.get('Authorization'); // Adjust this line as needed for your auth logic

	if (isAuthenticated) {
		const { searchQuery, collection, numCandidates, limit } =
			await req.json();

		// Validate required parameters
		if (!searchQuery || !collection) {
			return NextResponse.json(
				{ message: 'Bad request' },
				{ status: 400 }
			);
		}

		try {
			// Get text embeddings
			const embeddingsData = await getTextEmbeddings(searchQuery);

			// Get vector search results
			const results = await getVectorSearchResults(
				embeddingsData,
				collection,
				numCandidates,
				limit
			);

			// Return the results
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

	// Return not authenticated response
	return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
}
