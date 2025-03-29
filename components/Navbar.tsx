"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/auth/profile");
        const data = await res.json();
        if (data?.profile) setUser(data.profile);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    getUser();
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout");
    router.push("/");
  };

  return (
    <nav className="flex flex-wrap items-center justify-between px-4 py-3 border-b bg-background w-full">
      <Link href="/" className="text-xl font-bold text-primary hover:opacity-80">
        ⚡ Hercules
      </Link>

      <div className="flex items-center gap-4 mt-2 md:mt-0">
        {!user ? (
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-medium px-3">
                {user.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>{user.name}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/${user.role.toLowerCase()}`)}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </Button>
      </div>
    </nav>
  );
}
