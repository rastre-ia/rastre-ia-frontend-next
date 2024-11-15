import dbConnect from "@/app/lib/mongodb";
import Users from "@/app/lib/schemas/User";
import StolenItem from "@/app/lib/schemas/Stolen";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();


  return NextResponse.json({ message: "Hello from the database!" });
}
