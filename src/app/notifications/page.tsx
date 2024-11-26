"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingButton } from "@/components/ui/loading-button";
import { markAllAsRead, toggleEntryRead } from "@/lib/db-utils";
import { ProviderContext } from "@/components/provider";
import { LoadingState } from "@/components/states";
import { useContext, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const NotificationsPage = () => {
  const { notifications, fetchData, loading } = useContext(ProviderContext)
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date)
  }

  const unreadCount = notifications.filter((notification) => !notification.read_at).length

  useEffect(() => {
    fetchData(['notifications'])
  }, [])

  return (
    <>
      <header className="sticky top-0 z-10 bg-background border-b border-border shadow-sm">
        <div className="container flex items-center justify-between p-2">
          <h1 className="text-lg font-bold transition-all">Notifications</h1>
          

          <LoadingButton
            variant='outline'
            size='sm'
            className="bg-white/5 border-white/10 h-7"
            disabled={unreadCount === 0}
            onClick={async() => {
              await markAllAsRead()
              fetchData(['notifications'])
              return true
            }}
          >
            Mark all as read
          </LoadingButton>
        </div>
      </header>

      {(notifications.length === 0) ? (
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
          {notifications.map((notification) => (
            <Card key={`notif-${notification.id}`} className={cn("mb-3 bg-white/10", notification.read_at && 'bg-white/5 opaicty-50 [&_*]:text-foreground/50')}>
              <CardHeader className="p-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  New Contact form submission
                  <Badge className="text-xs">
                    Contact
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="mb-2 text-sm">{notification.name} submitted a new contact form</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{formatDate(new Date(notification.created_at))}</span>
                  <LoadingButton
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={async () => {
                      await toggleEntryRead( notification.id, !notification.read_at )
                      fetchData(['notifications'])
                      return true
                    }}
                  >
                    <Check className="h-3 w-3 mr-1" /> Mark as {!!notification.read_at && 'un'}read
                  </LoadingButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </main>
      )}
    </>
  );
}
 
export default NotificationsPage;