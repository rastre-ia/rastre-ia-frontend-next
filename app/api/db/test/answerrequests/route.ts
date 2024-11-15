import dbConnect from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';
import AnswerRequests from '@/app/lib/schemas/AnswerRequests';
import PoliceStations from '@/app/lib/schemas/PoliceStations';

export async function GET() {
	await dbConnect();

	const answerRequests = await AnswerRequests.find({});

	return NextResponse.json({ answerRequests });
}

/* sample
{
	"policeStationId": "6736a7c57e75ea4b7c0cf489",
    "location": {
        "type": "Point",
        "coordinates": [-32.2, -31.42]
    },
    "requestRadius": "1000",
    "priority": "high",
    "message":
        "Você notou algo de diferente na rua Julio de Castilhos no dia 22 de abril?",
    "status": "on_going"
}
*/

export async function POST(req: Request) {
	// Default values
	const {
		policeStationId,
		location,
		requestRadius,
		priority,
		message,
		status,
	} = await req.json();

	await dbConnect();

	const policeStation = await PoliceStations.findById(policeStationId).catch(
		(error) => {
			return NextResponse.json(
				{ message: 'Police Station not found' },
				{ status: 404 }
			);
		}
	);

	try {
		const newAnswerRequests = await AnswerRequests.create({
			policeStationId: policeStation._id,
			location,
			requestRadius,
			priority,
			message,
			status,
		});

		return NextResponse.json({ newAnswerRequests, success: true });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Error creating answer request', error },
			{ status: 500 }
		);
	}
}
