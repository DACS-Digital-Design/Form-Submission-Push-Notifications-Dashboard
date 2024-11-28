"use client"

import { checkTokenEnabled, fetchContacts, fetchNotifications, getContactCount } from "@/lib/db-utils";
import { createContext, ReactNode, useEffect, useState } from "react";
import type { ContactEntry, Notification } from "@/lib/db-utils";
import { db, defaultSettings, Settings } from "@/db";
import { ThemeProvider } from "next-themes";
import { fetchToken } from "@/firebase";
import { Session } from "next-auth";
import { parseToNotifications } from "@/lib/utils";

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
      try {
        setNotifications(await fetchNotifications());
      } catch (error) {
        setNotifications(
          parseToNotifications(
            (await db.getSettings()).entries.slice(0, 10)
          )
        )
      }
    }
    if (dataToFetch === "all" || dataToFetch.includes("contacts")) {
      // Workflow:
      // 1. Fetch data from IndexedDB
      // 2. Fetch any new data from the database
      // 3. Update the IndexedDB with the new data
      // 4. Set the state with the new data
      let data: ContactEntry[] = [];
      let newContactsCount: number = 0;

      data.push(...((await db.getSettings()).entries))

      try {
        newContactsCount = await getContactCount() - data.length;
      } catch (error) {
        console.info(await error);
      }
      
      if (newContactsCount > 0) {
        // Try-Catch block to handle any errors that may occur during the fetch
        // Specifically, if the user is offline, the fetch will fail
        try {
          const newContacts = await fetchContacts({ index: data.length, amount: newContactsCount });
          data.push(...newContacts)
          await db.updateSettings({ entries: data });
        } catch (error) {
          console.info(await error);
        }
      }

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