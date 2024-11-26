# Form Viewer PWA Template

This repository contains a **Progressive Web App (PWA)** template designed to streamline form management for freelancers working with multiple clients. Built with cutting-edge technologies like **Next.js**, **Tailwind CSS**, **shadcn**, **Prisma**, **PostgreSQL**, **Auth.js**, **TypeScript**, and **Firebase**, this project serves as a mobile-friendly dashboard for tracking, viewing, and managing form submissions.

## Purpose

The **Form Viewer PWA Template** is tailored for freelancers who manage websites for multiple clients. Its primary use case is to act as a centralized dashboard for handling form submissions across clients' websites. The app supports:

1. **Seamless Integration:** Client websites send `POST` requests to the `/api/submit-form` route with form data.
2. **Data Organization:** Form submissions are stored in a **PostgreSQL database** with clear schema separation for each client.
3. **Push Notifications:** With **Firebase Cloud Messaging (FCM)** integration, freelancers receive real-time notifications for new submissions.
4. **Ease of Access:** A responsive and dynamic UI for reviewing, managing, and organizing form data.

## Tech Stack

- **Frontend & Backend:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) and [shadcn](https://shadcn.dev/)
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Authentication:** [Auth.js](https://authjs.dev/) with Google OAuth integration
- **Programming Language:** [TypeScript](https://www.typescriptlang.org/)
- **Push Notifications:** [Firebase Cloud Messaging (FCM)](https://firebase.google.com/docs/cloud-messaging)

## Key Features

- **Dynamic Data Handling:** 
  - Form submissions are appended to the database under the following schema:

    ```prisma
    model Entry {
      id         String   @id @default(cuid())
      content    String   @unique // JSON string
      client_id  String
      archived   Boolean  @default(false)
      read_at    DateTime?
      created_at DateTime @default(now())
      updated_at DateTime @default(now()) @updatedAt
    }
    ```

  - Each form entry contains:
    - `client_id`: Identifies which client the submission belongs to.
    - `content`: A stringified JSON object of the submitted data.
    - Other metadata to track state and timestamps.

- **Type-Safe Conversions:** Functions are provided to parse and convert `content` into type-safe variables and arrays for streamlined usage.
- **Data Protections:** Built-in safeguards prevent accidental editing or modification of the wrong entries.
- **Push Notification Setup:** This project integrates Firebase for sending notifications based on submission events, making client management more efficient.

## Workflow for Freelancers

1. **Setup:** Deploy this PWA and set up client IDs for each of your customers.
2. **Integration:** Add the `/api/submit-form` endpoint to your clients' websites. Ensure their forms send `POST` requests with relevant data.
3. **Data Management:** Access submissions in the app, sorted by client. Use the UI to mark submissions as read, archive them, or process them further.
4. **Notifications:** Stay updated with real-time push notifications for new submissions.
5. **Efficiency:** Use the type-safe parsing utilities to handle data without errors.

## How It Works

1. **Form Submission:**
   - A client's website sends a `POST` request to `/api/submit-form` with the form data as a JSON payload.
   - Example Payload:

     ```json
     {
       "client_id": "client123",
       "form_data": {
         "name": "John Doe",
         "email": "john@example.com",
         "phone": "(123) 456-7890",
         "message": "Hello!"
       }
     }
     ```

2. **Database Storage:**
   - The server appends the form data to the `Entry` model in the database:
     - `client_id` maps the entry to the correct client.
     - `content` stores the stringified JSON object of the form data.

3. **Data Display:**
   - The frontend parses and displays form entries dynamically for easy viewing and management.

4. **Notifications:**
   - Using Firebase Cloud Messaging (FCM), push notifications alert you to new submissions.

## Prerequisites

### Required Environment Variables

Configure the following environment variables in your `.env` file:

- **Database:**
  - `DATABASE_URL`: PostgreSQL connection string.
  - `NEXT_PUBLIC_CLIENT_ID`: Current client's ID.

- **Authentication:**
  - `AUTH_SECRET`: Secret key for **Auth.js**.
  - `AUTH_GOOGLE_ID`: Google OAuth Client ID.
  - `AUTH_GOOGLE_SECRET`: Google OAuth Client Secret.

- **Firebase:**
  - `NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY`: VAPID key for **Firebase FCM**.
  - `NEXT_PUBLIC_CLIENT_ID`: Public identifier for the specific client.
  - `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase API Key.
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase Auth Domain.
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase Project ID.
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase Storage Bucket.
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase Messaging Sender ID.
  - `NEXT_PUBLIC_FIREBASE_APP`: Firebase App Name.
  - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: Firebase Measurement ID.

### Example `.env` File:

```env
DATABASE_URL=your_postgresql_connection_string
NEXT_PUBLIC_CLIENT_ID=current_client_id

AUTH_SECRET=your_auth_secret_key
AUTH_GOOGLE_ID=your_google_oauth_client_id
AUTH_GOOGLE_SECRET=your_google_oauth_client_secret

NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY=your_firebase_vapid_key
NEXT_PUBLIC_CLIENT_ID=your_client_id
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP=your_firebase_app_name
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DACS-Digital-Design/Form-Submission-Push-Notifications-Dashboard.git
   cd Form-Submission-Push-Notifications-Dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your `.env` file with database and Firebase credentials.

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Firebase FCM Setup

This project’s Firebase Cloud Messaging setup was inspired by a [tutorial repository](https://github.com/Dulajdeshan/nextjs-firebase-messaging). Refer to it for detailed instructions on configuring FCM for notifications.

## Contributions

Feel free to submit pull requests or open issues to suggest improvements.

## License

This project is open-source and available under the MIT License.
