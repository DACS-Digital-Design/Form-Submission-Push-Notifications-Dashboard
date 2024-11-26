"use client"

import { checkTokenEnabled, fetchContacts, fetchNotifications } from "@/lib/db-utils";
import { createContext, ReactNode, useEffect, useState } from "react";
import type { ContactEntry, Notification } from "@/lib/db-utils";
import { db, defaultSettings, Settings } from "@/db";
import { ThemeProvider } from "next-themes";
import { fetchToken } from "@/firebase";
import { Session } from "next-auth";

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
    name: "",
    email: "",
    phone: "",
    message: "",
    archived: false,
    read_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  } as ContactEntry],
  fetchData: async (dataToFetch: ("notifications" | "contacts" | "settings" | "token")[] | "all" ) => {},
  settings: defaultSettings,
  loading: true,
  session: null as Session | null,
})

export const Provider = ({ children, session }: { children: ReactNode, session: Session | null }) => {
  const [loading, setLoading] = useState<boolean>(true);

  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [contacts, setContacts] = useState<ContactEntry[]>([]);

  useEffect(() => {
    (async() => {
      setLoading(true);

      setSettings(await db.getSettings())
      setNotifications(await fetchNotifications());

      setLoading(false);
    })()
  }, [])

  useEffect(() => {
    uploadToken()
  }, [session, settings.token])

  const fetchData = async ( dataToFetch: ("notifications" | "contacts" | "settings" | "token")[] | "all" ) => {
    setLoading(true);

    if (dataToFetch === "all" || dataToFetch.includes("notifications")) {
      setNotifications(await fetchNotifications());
    }
    if (dataToFetch === "all" || dataToFetch.includes("contacts")) {
      // Fetch data from the database, if empty, fetch cached data from IndexedDB
      let data = await fetchContacts()
      if (data.length === 0) data = (await db.getSettings()).entries

      // Set the contacts state only if data is not empty
      if (data.length > 0) await db.updateSettings({ entries: data });
      
      // Return the data to the state
      setContacts(data);
    }
    if (dataToFetch === "all" || dataToFetch.includes("settings")) {
      setSettings(await db.getSettings())
    }
    if (dataToFetch === "all" || dataToFetch.includes("token")) {
      await db.updateSettings({ token: await fetchToken() });
      setSettings(await db.getSettings())
    }

    setLoading(false);
  }

  const uploadToken = async () => {
    // If cookies have been fetched and a token exists, or if we're not logged in, return
    if (!session) return;

    if (Notification.permission === 'granted') {
      if (!settings.token) return fetchData(['token', 'settings']);

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