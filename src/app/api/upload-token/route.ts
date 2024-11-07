import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  const { token, email } = await request.json();

  try {
    await prisma.fCMToken.upsert({
      where: { token },
      create: {
        email,
        token
      },
      update: {
        email,
        token
      }
    })

    return NextResponse.json({ success: true, message: "Uploaded FCM Token!", token });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error });
  }
}
