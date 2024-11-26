import { MulticastMessage } from 'firebase-admin/messaging';
import { NextRequest, NextResponse } from 'next/server';
import { createId } from '@paralleldrive/cuid2';
import prisma from '@/prisma/client';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = require('@/service_key.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const isBot = (body.subject?.length as number) > 0;

    if (isBot) {
      return NextResponse.json({ message: 'Message sent!' }, { status: 200 });
    }

    delete body.subject;
    await prisma.entry.upsert({
      where: {
        content: JSON.stringify(body),
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string,
      },
      update: {},
      create: {
        id: createId(),
        content: JSON.stringify(body),
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string,
      }
    })

    const tokens = (await prisma.fCMToken.findMany({
      where: {
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string,
        active: true,
      },
      select: {
        token: true,
      }
    })).map((t) => t.token)

    const title = 'New Contact Form Submission';
    const payloadBody = `Name: ${body.name}\nEmail: ${body.email}\nPhone Number: ${body.phone}`;
    const link = process.env.NEXT_PUBLIC_BASE_URL as string;

    const payload: MulticastMessage = {
      tokens,
      notification: {
        title,
        body: payloadBody,
      },
      data: {
        title,
        body: payloadBody,
        link,
      },
      webpush: {
        fcmOptions: {
          link,
        },
      },
      android: {
        notification: {
          icon: '/graphic.png',
          priority: 'max',
          visibility: 'public',
        },
      },
    };

    await admin.messaging().sendEachForMulticast(payload);

    return NextResponse.json({ message: 'Message sent! Whoo!' }, { status: 200 });
  } catch (error) {
    console.error(await error);
    return NextResponse.json({ message: 'Message not sent!' }, { status: 500 });
  }
}