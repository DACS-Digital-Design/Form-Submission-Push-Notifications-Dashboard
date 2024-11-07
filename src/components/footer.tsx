"use client"
import { Bell, Home, Settings, User } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import { ProviderContext } from "./provider";

const Footer = () => {
  const { notifications } = useContext(ProviderContext)
  const path = usePathname()

  const unreadCount = notifications.filter(notification => !notification.read_at).length
  return (
    <footer className="sticky bottom-0 bg-background border-t border-border">
      <nav className="grid grid-cols-3 gap-4 p-2 container transition-all">
        <Link href="/" className="w-full">
          <Button variant="ghost" className={cn("flex flex-col items-center h-auto w-full", path === '/' && 'bg-accent')}>
            <Home className="size-6" />
            <span className="text-xs leading-[8px]">Home</span>
          </Button>
        </Link>
        <Link href="/notifications">
          <Button variant="ghost" className={cn("flex flex-col items-center h-auto relative w-full", path === '/notifications' && 'bg-accent')}>
            <Bell className="size-6" />
            <span className="text-xs leading-[8px]">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 right-[calc(50%-24px)] h-5 w-auto p-1.5 text-xs">
                {unreadCount >= 10 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </Link>
        <Link href="/settings">
          <Button variant="ghost" className={cn("flex flex-col items-center h-auto w-full", path === '/settings' && 'bg-accent')}>
            <Settings className="size-6" />
            <span className="text-xs leading-[8px]">Settings</span>
          </Button>
        </Link>
      </nav>
    </footer>
  );
}
 
export default Footer;