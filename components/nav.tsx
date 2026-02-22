"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Briefcase, Home, User, Mail, Info, Brain } from "lucide-react";

export function Nav() {
  const pathname = usePathname();
  const { isSignedIn, signOut } = useAuth();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/ai-interview", label: "AI Interview", icon: Brain },
    { href: "/contact", label: "Contact", icon: Mail },
    { href: "/about", label: "About", icon: Info },
  ];

  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-semibold text-primary">
          Job Platform
        </Link>
        <div className="flex items-center gap-1 sm:gap-4">
          <ThemeToggle />
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <Button
                variant={pathname === href ? "secondary" : "ghost"}
                size="sm"
                className="gap-1.5"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Button>
            </Link>
          ))}
          {isSignedIn && (
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
