# Website Request PWA

This is a mobile-based Progressive Web App (PWA) built with Next.js 14 and a range of modern technologies. The app is designed to streamline website requests, saving them to a database and notifying registered devices using Firebase Cloud Messaging (FCM) when a request is made. 

## Tech Stack

- **Next.js 14** - Framework for the PWA, providing SSR and API handling.
- **Shadcn UI** - Component library for a responsive, cohesive design.
- **Tailwind CSS** - Utility-first CSS framework for styling.
- **Prisma** - ORM for database handling.
- **Firebase** - Backend services for push notifications.
- **Auth.js** - For handling authentication.
- **TypeScript** - Type safety across the app.

## Features

- **Database Integration**: Automatically saves all website requests to the database using Prisma.
- **Push Notifications**: Sends push notifications to registered devices when a new request is submitted (set up with Firebase Cloud Messaging).
- **Mobile-Friendly**: Optimized for mobile experience, PWA ready.

## Quick Setup Guide

### Prerequisites

- Node.js (v16+)
- A Firebase project with FCM enabled
- A PostgreSQL or other database for Prisma (make sure to update your `.env` with the correct database URL)

### Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/DACS-Digital-Design/Form-Submission-Push-Notifications-Dashboard.git
   cd Form-Submission-Push-Notifications-Dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   - Create a Firebase project and enable Firebase Cloud Messaging (FCM).
   - Follow this [tutorial](https://github.com/Dulajdeshan/nextjs-firebase-messaging) for setting up FCM with your Next.js app.
   - Download your `firebase-config.json` and add it to your project directory (or wherever your Firebase configuration is read from).

4. **Environment Variables**

   create a .env file in the root of the project with the following variable:
   ```plaintext
   DATABASE_URL="your_database_url"
   ```


   Create a `.env.local` file in the root of the project with the following variables:

   ```plaintext
   AUTH_SECRET="your_authjs_secret"

   NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_api_key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
   NEXT_PUBLIC_FIREBASE_DATABASE_URL="your_firebase_database_url"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_firebase_project_id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
   NEXT_PUBLIC_FIREBASE_APP="your_firebase_app_id"
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your_firebase_measurement_id"

   MY_EMAILS='stringified_array_of_emails'
   ```
   Note that in an effort to avoid leaking my own keys and data I've taken some weird measures for hiding some keys. In this example, the ```MY_EMAILS``` will be parsed and compared for the authentication process, but you can implement whatever auth logic you want.

5. **Set Up Prisma**

   Generate your Prisma client and run migrations:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Run the Development Server**

   ```bash
   npm run dev
   ```

   Visit [https://localhost:3000](https://localhost:3000) in your browser to view the app.

### How the FCM Integration Works

Whenever a website request is submitted via the app, it triggers a Firebase Cloud Messaging (FCM) notification to all registered devices. For setting up the FCM messaging system, I followed this [GitHub tutorial](https://github.com/Dulajdeshan/nextjs-firebase-messaging), which provides a solid foundation for integrating push notifications into a Next.js app.

Below is a code block from my personal website which triggers the push notifications:
```typescript
import { MulticastMessage } from "firebase-admin/messaging";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = require("@/service_key.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  const title = "New Contact Form Submission";
  const body = `Name: ${data.first_name + " " + data.last_name}\nEmail: ${data.email}\nProject Info: ${data.project_info}`;
  const link = "https://your-instance-url.com/";

  try {
    await prisma.contact.create({ data });

    const tokens = await prisma.fCMToken.findMany({
      where: { active: true }
    })
    const payload: MulticastMessage = {
      tokens: tokens.map((t) => t.token),
      notification: {
        title,
        body,
      },
      data: {
        title,
        body,
        link,
      },
      webpush: link && {
        fcmOptions: {
          link,
        },
      },
      android: {
        notification: {
          icon: "/graphic.webp",
          priority: 'max',
          visibility: 'public',
        }
      }
    };

    await admin.messaging().sendEachForMulticast(payload);

    // Revalidate the contact form page
    fetch('https://your-instance-url.com/api/revalidate')

    return NextResponse.json({
      success: true,
      message: "Message sent!", 
    }, {
      status: 200,
      statusText: "OK",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
```


This will upload the contact form data to your database, then send your registered devices a push notification. Everything should be visible from the dashboard.

### Deployment

For deployment, you can use Vercel, Heroku, or any other platform that supports Node.js. Make sure to add all required environment variables on your hosting platform for Firebase, database URL, and other configurations.

## Contributing

Feel free to fork this repo and create a pull request if you have suggestions or improvements. 
