import dbConnect from "@/app/lib/mongodb";
import Users from "@/app/lib/schemas/User";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const newUser = await Users.create({
    name: "John Doe",
    email: "asdf",
  });

  console.log(newUser);

  return NextResponse.json({ message: "Hello from the database!" });
}
