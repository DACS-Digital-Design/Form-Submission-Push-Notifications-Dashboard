"use client"

import { Contact, Review } from "@/app/page";
import { fetchContacts, fetchNotifications, fetchReviews, Notification } from "@/lib/db";
import { createContext, ReactNode, useEffect, useState } from "react";

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
  fetchData: (dataToFetch: ("notifications" | "contacts" | "reviews"| "cookies")[] | "all" ) => {},
  cookies: [{
    key: "",
    value: ""
  }],
  loading: true
})

export const Provider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cookies, setCookies] = useState<{ key: string, value: string }[]>([]);

  useEffect(() => {
    setLoading(true);

    if (document && document.cookie) {
      setCookies(
        document.cookie.split('; ').join().split(',').map(cookie => cookie.split('=')).map(([key, value]) => ({ key, value }))
      )
    }

    setLoading(false);
  }, [])

  const fetchData = async ( dataToFetch: ("notifications" | "contacts" | "reviews"| "cookies")[] | "all" ) => {
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
    if (dataToFetch === "all" || dataToFetch.includes("cookies")) {
      if (document && document.cookie) {
        setCookies(
          document.cookie.split('; ').join().split(',').map(cookie => cookie.split('=')).map(([key, value]) => ({ key, value }))
        )
      }
    }

    setLoading(false);
  }

  return (
    <ProviderContext.Provider
      value={{
        notifications,
        contacts,
        reviews,
        fetchData,
        cookies,
        loading
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
}
 
export default Provider;