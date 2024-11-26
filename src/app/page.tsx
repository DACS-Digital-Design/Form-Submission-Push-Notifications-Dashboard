"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Archive, ArchiveRestore, ArrowUpDown } from 'lucide-react';
import { LoadingButton } from "@/components/ui/loading-button";
import { archiveContacts, ContactEntry } from '@/lib/db-utils';
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { ProviderContext } from "@/components/provider";
import { LoadingState } from "@/components/states";
import { useContext, useEffect } from "react";
import { AsYouType } from "libphonenumber-js";
import { db } from "@/db";

function sortContacts(contacts: ContactEntry[], sortOrder: 'asc' | 'desc', showArchived: boolean) {
  return contacts
    .filter(contact => showArchived ? true : !contact.archived)
    .sort((a, b) => sortOrder === 'asc' 
      ? a.created_at.getTime() - b.created_at.getTime()
      : b.created_at.getTime() - a.created_at.getTime()
    )
}

export default function HomePage() {
  const { contacts, settings, fetchData, loading } = useContext(ProviderContext)

  useEffect(() => {
    fetchData(["contacts", "settings"])
  }, [])

  const sortOrder = settings.sortOrder
  const showArchived = settings.showArchived

  const sortedContacts = sortContacts(contacts, sortOrder, showArchived)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date)
  }

  return (
    <>
      <header className="sticky top-0 z-10 bg-background border-b border-border shadow-sm">
        <h1 className="text-lg font-bold container p-2 transition-all">Dashboard</h1>
      </header>

        {(contacts.length === 0) ? (
          loading ? (
            <main className="flex-1 flex items-center justify-center text-center flex-col">
              <LoadingState />
            </main>
          ) :  (
            <main className="flex-1 flex items-center justify-center text-center flex-col">
              <h1 className="text-lg font-bold">No Contacts Found</h1>
            </main>
          )
        ) : (
          <main className="flex-grow p-2 transition-all overflow-y-auto container">
            <div className="flex space-x-2 mb-2">
              <LoadingButton
                variant="outline"
                className={cn("font-semibold w-full", sortOrder === 'asc' && 'bg-foreground/10')}
                onClick={async () => {
                  await db.updateSettings({ sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' })
                  fetchData(['settings'])
                  return true
                }}
              >
                <span className="max-xs:hidden">Sort Order: {capitalizeFirstLetter(sortOrder)}</span>
                <ArrowUpDown />
              </LoadingButton>

              <LoadingButton
                variant="outline"
                className={cn("font-semibold w-full", showArchived && 'bg-foreground/10')}
                onClick={async () => {
                  await db.updateSettings({ showArchived: !showArchived })
                  fetchData(['settings'])
                  return true
                }}
              >
                <span className="max-xs:hidden">Archived {showArchived ? 'Shown' : 'Hidden'}</span>
                <Archive />
              </LoadingButton>
            </div>
              {/* <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input type="search" placeholder="Search..." className="pl-8 h-8 text-sm" />
              </div> */}
            {sortedContacts.map((contact) => (
              <Card key={contact.id} className={`mb-3 ${contact.archived ? 'opacity-60' : ''}`}>
                <CardHeader className="p-3">
                  <CardTitle className="text-base">
                    {contact.name}
                  </CardTitle>
                  <CardDescription className="text-xs">{contact.email} | {new AsYouType('US').input(contact.phone)}</CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="mb-2 text-sm">{contact.message}</p>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-font-semiboldd mt-2">Created: {formatDate(contact.created_at)}</p>
          
                    <LoadingButton
                      variant="outline"
                      size="sm"
                      className="font-semibold"
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
          </main>
        )}
    </>
  )
}