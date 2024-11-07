"use server"

import { Contact } from "@/app/page";
import prisma from "@/prisma/client";

export const fetchContacts = async (): Promise<Contact[]> => {
  return await prisma.contact.findMany({})
}

export const archiveContacts = async (entryIDs: string[], archived: boolean) => {
  try {
    await prisma.contact.updateMany({
      where: {
        id: {
          in: entryIDs
        }
      },
      data: {
        archived
      }
    })

    return true;
  } catch (error) {
    console.error(false);
    return false;
  }
}

export const fetchReviews = async () => {
  return await prisma.review.findMany({})
}

export const archiveReviews = async (entryIDs: string[], archived: boolean) => {
  try {
    await prisma.review.updateMany({
      where: {
        id: {
          in: entryIDs
        }
      },
      data: {
        archived
      }
    })

    return true;
  } catch (error) {
    console.error(false);
    return false;
  }
}

export type Notification = {
  id: string
  name: string
  type: "contact" | "review"
  created_at: Date
  read_at?: Date
}

export const fetchNotifications = async () => {
  const notifs: Notification[] = []

  const contacts = await prisma.contact.findMany({
    orderBy: {
      created_at: 'desc'
    },
    take: 5
  })
  contacts.forEach((contact) => {
    notifs.push({
      id: contact.id,
      name: `${contact.first_name} ${contact.last_name}`,
      type: "contact",
      created_at: contact.created_at,
      read_at: contact.read_at
    } as Notification)
  })

  const reviews = await prisma.review.findMany({
    orderBy: {
      created_at: 'desc'
    },
    take: 5
  })
  reviews.forEach((review) => {
    notifs.push({
      id: review.id,
      name: review.business_name,
      type: "review",
      created_at: review.created_at,
      read_at: review.read_at
    } as Notification)
  })

  return notifs.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
}

export const toggleEntryRead = async ( id: string, type: "contact" | "review", markAsRead: boolean ) => {
  if (type === "contact") {
    await prisma.contact.update({
      where: {
        id
      },
      data: {
        read_at: markAsRead ? new Date() : null
      }
    })
  } else {
    await prisma.review.update({
      where: {
        id
      },
      data: {
        read_at: markAsRead ? new Date() : null
      }
    })
  }
}

export const markAllAsRead = async () => {
  await prisma.contact.updateMany({
    where: {
      read_at: null
    },
    data: {
      read_at: new Date()
    }
  })

  await prisma.review.updateMany({
    where: {
      read_at: null
    },
    data: {
      read_at: new Date()
    }
  })
}

export const checkTokenEnabled = async( token: string ) => {
  return (await prisma.fCMToken.findUnique({ where: { token } }))?.active as boolean
}

export const togglePushNotifications = async (active: boolean, token: string) => {
  await prisma.fCMToken.update({
    where: { token },
    data: { active }
  })
}