"use client";

import { Power, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { userLogout } from "@/lib/common";

const AppHeader = () => {
  return (
    <div className="border-b bg-primary/50 h-14 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold truncate">Admin Dashboard</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* User dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full hidden sm:flex",
                "after:content-[''] after:w-2 after:h-2 after:bg-green-500 after:rounded-full after:absolute after:bottom-0 after:right-0 after:border-2 after:border-background"
              )}
            >
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="font-medium">Admin User</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={userLogout}>
              <Power className="h-5 w-5 text-destructive" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile user button - only shown on small screens */}
        <Button
          variant="ghost"
          size="sm"
          className="sm:hidden rounded-full w-8 h-8 p-0"
        >
          <User className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AppHeader;
