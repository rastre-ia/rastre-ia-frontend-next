import { NextResponse } from 'next/server';
import Reports, {
	ReportAssistanceNeededEnum,
	ReportSchemaInterface,
	ReportStatusEnum,
} from '@/app/lib/schemas/Reports';
import { auth } from '@/auth';
import generateUserActivity from '@/app/lib/generate-user-activity';
import { ActivityTypeEnum } from '@/app/lib/schemas/UserActivities';
import dbConnect from '@/app/lib/mongodb';
import RolesEnum from '@/app/lib/schemas/helpers/RolesEnum';
import { getTextEmbeddings, getVectorSearchResults } from '@/app/lib/embeddings-api';


export const POST = auth(async function POST(req) {
	if (req.auth) {
		const {
            searchQuery,
			collection,
			numCandidates,
			limit
		} = await req.json();

		if(!searchQuery || !collection)
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
});
