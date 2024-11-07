"use client"

import { checkTokenEnabled, fetchContacts, fetchNotifications, fetchReviews } from "@/lib/db-utils";
import { createContext, ReactNode, useEffect, useState } from "react";
import { Contact, Review } from "@/app/page";
import type { Notification } from "@/lib/db-utils";
import { ThemeProvider } from "next-themes";
import { fetchToken } from "@/firebase";
import { Session } from "next-auth";
import { db, defaultSettings, Settings } from "@/db";

export const ProviderContext = createContext({
  notifications: [{
    id: "",
    name: "",
    type: "contact",
    created_at: new Date(),
    read_at: new Date()
  } as Notification],
  contacts: [{
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    project_info: "",
    objective: "fresh",
    archived: false,
    read_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  } as Contact],
  reviews: [{
    id: "",
    business_name: "",
    website_type: "",
    rating: 0,
    summary: "",
    favorite_feature: "",
    improvements: "",
    archived: false,
    read_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  } as Review],
  fetchData: async (dataToFetch: ("notifications" | "contacts" | "reviews"| "settings" | "token")[] | "all" ) => {},
  settings: defaultSettings,
  loading: true,
  session: null as Session | null,
})

export const Provider = ({ children, session }: { children: ReactNode, session: Session | null }) => {
  const [loading, setLoading] = useState<boolean>(true);

  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    (async() => {
      setLoading(true);

      setSettings(await db.getSettings())

      setLoading(false);
    })()
  }, [])

  useEffect(() => {
    uploadToken()
  }, [session, settings.token])

  const fetchData = async ( dataToFetch: ("notifications" | "contacts" | "reviews"| "settings" | "token")[] | "all" ) => {
    setLoading(true);

    if (dataToFetch === "all" || dataToFetch.includes("notifications")) {
      setNotifications(await fetchNotifications());
    }
    if (dataToFetch === "all" || dataToFetch.includes("contacts")) {
      setContacts(await fetchContacts());
    }
    if (dataToFetch === "all" || dataToFetch.includes("reviews")) {
      setReviews(await fetchReviews());
    }
    if (dataToFetch === "all" || dataToFetch.includes("settings")) {
      setSettings(await db.getSettings())
    }
    if (dataToFetch === "all" || dataToFetch.includes("token")) {
      await db.updateSettings({ token: await fetchToken() });
    }

    setLoading(false);
  }

  const uploadToken = async () => {
    // If cookies have been fetched and a token exists, or if we're not logged in, return
    if (!session) return;

    if (Notification.permission === 'granted') {
      if (!settings.token) return await fetchData(['token']);

      fetch('/api/upload-token', {
        method: 'POST',
        body: JSON.stringify({ token: settings.token, email: session?.user?.email }),
      })
    }
  }

  return (
    <ProviderContext.Provider
      value={{
        notifications,
        contacts,
        reviews,
        fetchData,
        settings,
        loading,
        session,
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
      >
        {children}
      </ThemeProvider>
    </ProviderContext.Provider>
  );
}
 
export default Provider;