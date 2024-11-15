import dbConnect from '@/app/lib/mongodb';
import Users from '@/app/lib/schemas/Users';
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import Reports, { ReportSchemaInterface } from '@/app/lib/schemas/Reports';

export async function POST(req: NextRequest) {
	const {
		userId,
		title,
		location,
		description,
		images,
		status,
		assistanceNeeded,
		type,
		submissionMethod,
		chatHistory,
		embeddings,
	} = (await req.json()) as ReportSchemaInterface;

	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	// Validate token
	if (!token) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	console.log(token);

	await dbConnect();

	try {
		const report = new Reports({
			userId,
			title,
			location,
			description,
			images,
			status,
			assistanceNeeded,
			type,
			submissionMethod,
			chatHistory,
			embeddings,
		});

		await report.save();

		return NextResponse.json({ message: 'Report created successfully' });
	} catch (error) {
		console.error('Error creating report:', error);
		return NextResponse.json(
			{ message: 'Error creating report' },
			{ status: 500 }
		);
	}
}
