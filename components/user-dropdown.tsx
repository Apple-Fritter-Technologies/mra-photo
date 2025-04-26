import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, Power, User, User2 } from "lucide-react";
import { userLogout } from "@/lib/common";
import { useUserStore } from "@/store/use-user";
import Link from "next/link";

const UserDropdown = () => {
  const { user } = useUserStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("rounded-full flex")}>
          <User className="h-5 w-5" />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="font-medium">{user?.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {user?.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin/dashboard">
              <LayoutDashboard className="h-5 w-5 text-gray-500" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href="/account">
            <User2 className="h-5 w-5 text-gray-500" />
            <span>Account</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/orders">
            <Package className="h-5 w-5 text-gray-500" />
            <span>Orders</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="text-destructive" onClick={userLogout}>
          <Power className="h-5 w-5 text-destructive" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
