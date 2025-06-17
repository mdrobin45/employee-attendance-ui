import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
   const body = await req.json();
   const response = await prisma.records.create({ data: body });
   if (!response)
      return NextResponse.json({ message: "Clock in failed" }, { status: 500 });
   return NextResponse.json(
      { message: "Clock in successful" },
      { status: 200 }
   );
};
