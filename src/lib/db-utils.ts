"use server"

import prisma from "@/prisma/client";
import { parseToNotifications } from "./utils";

type basicEntry = {
  id: string
  client_id: string
  archived: boolean
  read_at: Date | null
  created_at: Date
  updated_at: Date
}

type Contact = {
  name: string
  email: string
  phone: string
  message: string
}

export type ContactEntry = basicEntry & Contact

const parseContacts = (contacts: (basicEntry & { content: string })[]) => {
  return contacts.map((contact) => {
    return {
      id: contact.id,
      client_id: contact.client_id,
      archived: contact.archived,
      read_at: contact.read_at,
      created_at: contact.created_at,
      updated_at: contact.updated_at,
      ...(JSON.parse(contact.content)) as Contact
    }
  }) as ContactEntry[]
}

export const fetchContacts = async ({ index = 0, amount = 10 }: { index?: number, amount?: number }): Promise<ContactEntry[]> => {
  try {
    return parseContacts(await prisma.entry.findMany({
      where: {
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string
      },
      orderBy: {
        created_at: 'desc'
      },
      skip: index,
      take: amount
    }))
  } catch (error) {
    console.info("DB-Utils Fetch Contacts: ", await error);
    return []
  }
}

export const getContactCount = async () => {
  return await prisma.entry.count({
    where: {
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string
    }
  })
}

export const archiveContacts = async (entryIDs: string[], archived: boolean) => {
  try {
    await prisma.entry.updateMany({
      where: {
        id: {
          in: entryIDs
        },
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string
      },
      data: {
        archived
      }
    })

    return true;
  } catch (error) {
    console.info("DB-Utils Fetch Contacts: ", await error);
    return false;
  }
}

export type Notification = {
  id: string
  name: string
  created_at: Date
  read_at: Date | null
}

export const fetchNotifications = async () => {
  const contacts = parseContacts(await prisma.entry.findMany({
    where: {
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string,
    },
    orderBy: {
      created_at: 'desc'
    },
    take: 10
  }))

  return parseToNotifications(contacts).sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
}

export const toggleEntryRead = async ( id: string, markAsRead: boolean ) => {
  await prisma.entry.update({
    where: {
      id,
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string
    },
    data: {
      read_at: markAsRead ? new Date() : null
    }
  })
}

export const markAllAsRead = async () => {
  await prisma.entry.updateMany({
    where: {
      read_at: null,
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string
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