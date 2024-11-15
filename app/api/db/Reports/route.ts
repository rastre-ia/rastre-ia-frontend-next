import dbConnect from '@/app/lib/mongodb';
import { NextResponse, NextRequest } from 'next/server';
import Reports, { ReportSchemaInterface } from '@/app/lib/schemas/Reports';
import { auth } from '@/auth';

export const POST = auth(async function POST(req) {
	if (req.auth) {
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

		if ((userId as string) !== req.auth.user._id)
			return NextResponse.json(
				{ message: 'Unauthorized to create report' },
				{ status: 401 }
			);

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

			// TODO Generate the user activity

			return NextResponse.json({
				message: 'Report created successfully',
			});
		} catch (error) {
			console.error('Error creating report:', error);
			return NextResponse.json(
				{ message: 'Error creating report', error },

				{ status: 500 }
			);
		}
	}
	return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
});
