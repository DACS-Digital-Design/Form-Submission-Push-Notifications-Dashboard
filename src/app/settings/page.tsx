"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { togglePushNotifications } from "@/lib/db-utils";
import { useContext, useEffect, useState } from "react";
import { ProviderContext } from "@/components/provider";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Moon, Sun } from "lucide-react";
import { signOut } from "next-auth/react"
import { useTheme } from "next-themes";
import { db } from "@/db";

const normalizeName = (name: string) => {
  return name.split(' ').map(word => word[0].toUpperCase()).join('').slice(0, 2)
}

const SettingsPage = () => {
  const { fetchData, settings, loading } = useContext(ProviderContext);
  const { session } = useContext(ProviderContext);
  
  const { setTheme } = useTheme();
  
  useEffect(() => {
    fetchData(['token', 'settings'])
  }, [])


  return (
    <>
      <header className="sticky top-0 z-10 bg-background border-b border-border shadow-sm">
        <h1 className="text-lg font-bold container p-2 transition-all">Settings</h1>
      </header>
      
      <main className="flex-grow p-2 transition-all overflow-y-auto container flex flex-col gap-4 mt-2">
      <Card className="grid grid-cols-[4.5rem_1fr] p-4 items-center overflow-ellipsis">
        {session ? (
          <>
            <Avatar className="row-span-2 size-16">
              <AvatarImage src={session?.user?.image ?? ""} alt="" className="size-16"/>
              <AvatarFallback className="bg-accent text-accent-contrast size-16 text-2xl mr-2">
                {normalizeName((session?.user?.name ?? session?.user?.email) as string)}
              </AvatarFallback>
            </Avatar>
            <span className="font-bold text-xl text-ellipsis overflow-hidden whitespace-nowrap">{session?.user?.name}</span>
            <div className="text-foreground/50 text-ellipsis overflow-hidden whitespace-nowrap">
              {session?.user?.email}
            </div>
          </>
        ) : (
          <>
            <Skeleton className="row-span-2 size-16 rounded-full" />
            <Skeleton className="h-[28px] w-20" />
            <Skeleton className="h-[20px] w-40" />
          </>
        )}
      </Card>


        <Card className="mb-3">
          <CardHeader className="p-3">
            <CardTitle className="text-base">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Moon className="size-4" />
                  <span className="text-sm font-medium">Dark Mode</span>
                </div>
                <Switch
                  checked={loading ? false : settings.theme === 'dark'}
                  onCheckedChange={async() => {
                    setTheme(settings.theme === 'dark' ? 'light' : 'dark')
                    await db.updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
                    fetchData(['settings'])
                  }}
                  aria-label="Toggle dark mode"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="size-4" />
                  <span className="text-sm font-medium">Notifications</span>
                </div>
                <Switch
                  disabled={loading || !session || !settings.token}
                  checked={(!session || !settings.token) ? false : settings.notificationsEnabled}
                  onCheckedChange={async() => {
                    try {
                      await togglePushNotifications(!settings.notificationsEnabled, settings.token as string)
                      await db.updateSettings({ notificationsEnabled: !settings.notificationsEnabled })
                      fetchData(['settings'])
                    } catch (error) {
                      console.log(`${settings.notificationsEnabled ? 'Disabling' : 'Enabling'} notifications:`, await error)
                      return false
                    }
                  }}
                  aria-label="Toggle notifications"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button variant='destructive' onClick={() => signOut()}>Log Out</Button>
      </main>
    </>
  );
}
 
export default SettingsPage;