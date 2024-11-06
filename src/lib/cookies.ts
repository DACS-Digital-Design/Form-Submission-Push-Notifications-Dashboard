"use server"

import { cookies } from "next/headers"

export const setCookie = async (key: string, value: string) => {
  cookies().set(key, value, {
    secure: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
  })

  return true
}