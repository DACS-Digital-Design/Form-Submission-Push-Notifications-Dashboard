"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Archive, ArchiveRestore, ArrowUpDown } from 'lucide-react';
import { LoadingButton } from "@/components/ui/loading-button";
import { archiveContacts, archiveReviews } from '@/lib/db';
import { ProviderContext } from "@/components/provider";
import { LoadingState } from "@/components/states";
import { useContext, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AsYouType } from "libphonenumber-js";
import { setCookie } from "@/lib/cookies";
import { cn } from "@/lib/utils";

export type Contact = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  project_info: string
  objective: "fresh" | "elevate" | "other"
  archived: boolean
  read_at: Date | null
  created_at: Date
  updated_at: Date
}

export type Review = {
  id: string
  business_name: string
  website_type: string
  rating: number
  summary: string
  favorite_feature: string | null
  improvements: string | null
  archived: boolean
  read_at: Date | null
  created_at: Date
  updated_at: Date
}

function sortContacts(contacts: Contact[], sortOrder: 'asc' | 'desc', showArchived: boolean) {
  return contacts
    .filter(contact => showArchived ? true : !contact.archived)
    .sort((a, b) => sortOrder === 'asc' 
      ? a.created_at.getTime() - b.created_at.getTime()
      : b.created_at.getTime() - a.created_at.getTime()
    )
}

function sortReviews(reviews: Review[], sortOrder: 'asc' | 'desc', showArchived: boolean) {
  return reviews
    .filter(review => showArchived ? true : !review.archived)
    .sort((a, b) => sortOrder === 'asc' 
      ? a.created_at.getTime() - b.created_at.getTime()
      : b.created_at.getTime() - a.created_at.getTime()
    )
}

export default function HomePage() {
  const { contacts, reviews, cookies, fetchData, loading } = useContext(ProviderContext)

  useEffect(() => {
    fetchData(["contacts", "reviews", "cookies"])
  }, [])

  const sortOrder = cookies.find(cookie => cookie.key === 'sort')?.value === 'oldest' ? 'asc' : 'desc'
  const showArchived = cookies.find(cookie => cookie.key === 'archived')?.value === 'true' || false

  const sortedContacts = sortContacts(contacts, sortOrder, showArchived)
  const sortedReviews = sortReviews(reviews, sortOrder, showArchived)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date)
  }

  const objectiveColors = {
    fresh: "bg-green-100 text-green-800",
    elevate: "bg-blue-100 text-blue-800",
    other: "bg-gray-100 text-gray-800",
  }

  return (
    <>
      <header className="sticky top-0 z-10 bg-background border-b border-border shadow-sm">
        <h1 className="text-lg font-bold container p-2 transition-all">Dashboard</h1>
      </header>
      
        {(loading && contacts.length === 0 && reviews.length === 0) ? (
          <main className="flex-1 flex items-center justify-center text-center flex-col">
            <LoadingState />
          </main>
        ) : (
          <main className="flex-grow p-2 transition-all overflow-y-auto container">
            <Tabs defaultValue="contacts">
              <div className="flex items-center justify-between gap-2 mb-3">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="contacts">Contacts</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <div className="flex space-x-2">
                  <LoadingButton
                    variant="outline"
                    size="icon"
                    className="text-xs size-9 shrink-0"
                    onClick={async () => {
                      await setCookie('sort', sortOrder === 'asc' ? 'newest' : 'oldest')
                      fetchData(['cookies'])
                      return true
                    }}
                  >
                    <ArrowUpDown />
                  </LoadingButton>

                  <LoadingButton
                    variant="outline"
                    size="icon"
                    className="text-xs size-9 shrink-0"
                    onClick={async () => {
                      await setCookie('archived', showArchived ? 'false' : 'true')
                      fetchData(['cookies'])
                      return true
                    }}
                  >
                    <Archive />
                  </LoadingButton>
                </div>
              </div>
              {/* <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input type="search" placeholder="Search..." className="pl-8 h-8 text-sm" />
              </div> */}
              <TabsContent value="contacts">
                {/* {contacts.length === 0 && <NoResultsFound />} */}
                {sortedContacts.map((contact) => (
                  <Card key={contact.id} className={`mb-3 ${contact.archived ? 'opacity-60' : ''}`}>
                    <CardHeader className="p-3">
                      <CardTitle className="text-base">
                        {`${contact.first_name} ${contact.last_name}`}
                      </CardTitle>
                      <CardDescription className="text-xs">{contact.email} | {new AsYouType('US').input(contact.phone_number)}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <p className="mb-2 text-sm">{contact.project_info}</p>
                      <div className="flex justify-between items-center">
                        <Badge className={cn("text-xs", objectiveColors[contact.objective])}>
                          {contact.objective}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs text-muted-foreground mt-2">Created: {formatDate(contact.created_at)}</p>
              
                        <LoadingButton
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={async () => {
                            await archiveContacts([contact.id], !contact.archived)
                            fetchData(['contacts'])
                            return true
                          }}
                        >
                          {contact.archived ? <ArchiveRestore className="h-4 w-4 mr-1" /> : <Archive className="h-4 w-4 mr-1" />}
                          {contact.archived ? 'Unarchive' : 'Archive'}
                        </LoadingButton>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="reviews">
                {/* {reviews.length === 0 && <NoResultsFound />} */}
                {sortedReviews.map((review) => (
                  <Card key={review.id} className={`mb-3 ${review.archived ? 'opacity-60' : ''}`}>
                    <CardHeader className="p-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        {review.business_name}
                        <span className="flex items-center">
                          {review.rating} <Star className="h-4 w-4 ml-1 fill-current text-yellow-400" />
                        </span>
                      </CardTitle>
                      <CardDescription className="text-xs">{review.website_type}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <p className="mb-2 text-sm">{review.summary}</p>
                      <p className="mb-2 text-sm"><strong>Favorite:</strong> {review.favorite_feature}</p>
                      <p className="mb-2 text-sm"><strong>Improve:</strong> {review.improvements}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">Created: {formatDate(review.created_at)}</p>
            
                        <LoadingButton
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={async () => {
                            await archiveReviews([review.id], !review.archived)
                            fetchData(['reviews'])
                            return true
                          }}
                        >
                          {review.archived ? <ArchiveRestore className="h-4 w-4 mr-1" /> : <Archive className="h-4 w-4 mr-1" />}
                          {review.archived ? 'Unarchive' : 'Archive'}
                        </LoadingButton>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </main>
        )
      }
    </>
  )
}