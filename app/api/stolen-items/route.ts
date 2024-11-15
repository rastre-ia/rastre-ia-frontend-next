import dbConnect from "@/app/lib/mongodb";
import StolenItem from "@/app/lib/schemas/Stolen";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
      const data = await request.json();  // Parse the incoming JSON data
      const { object, robberyDate, imageUrl, description, eventDescription, robberCharacteristics, location } = data;
  
      // Save the stolen item data to the database
      const newStolenItem = new StolenItem({
        object,
        robberyDate,
        imageUrl,
        description,
        eventDescription,
        robberCharacteristics,
        location,
      });
  
      await newStolenItem.save();  // Save the document in MongoDB
  
      return NextResponse.json({ message: "Registrado com sucesso!" });
    } catch (error) {
      return NextResponse.json({ message: "Error no registro" }, { status: 500 });
    }
  }
  