import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ContactEntry, Notification } from "./db-utils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export const parseToNotifications = ( entries: ContactEntry[] ): Notification[] => {
  return entries.map(entry => ({
    id: entry.id,
    name: entry.name,
    created_at: entry.created_at,
    read_at: entry.read_at
  }))
}