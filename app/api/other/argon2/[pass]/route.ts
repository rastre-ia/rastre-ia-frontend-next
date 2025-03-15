import argon2 from '@node-rs/argon2';
import { NextResponse } from 'next/server';

// Endpoint: /api/other/argon2/[pass]
// This tests the argon2 hashing function
// 123123 = $argon2id$v=19$m=19456,t=2,p=1$7NI8ePerwEHir1wSE4s+oA$91JLCEHp3p4XemfmSZT4YQIuuIRtwmol0hzOa1+CgJc
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ pass: string }> }
) {
	const hashed = await argon2.hash((await params).pass);

	return NextResponse.json({ hashed });
}
