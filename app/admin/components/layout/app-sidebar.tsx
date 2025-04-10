"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/lib/common";
import { adminNavItems } from "@/lib/data";

interface NavItemProps {
  href: string;
  icon: LucideIcon | null;
  label: string;
  isCollapsed: boolean;
  onClick: () => void;
}

const NavItem = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
  onClick,
}: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-md",
                isActive
                  ? "bg-secondary/10 text-secondary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {Icon && <Icon className="h-5 w-5" />}
              <span className="sr-only">{label}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 font-medium",
        isActive
          ? "bg-secondary/10 text-secondary"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
      onClick={onClick}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {label}
    </Link>
  );
};

const AppSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Track viewport size
  const isMobile = useMediaQuery("(min-width: 768px)");

  // Collapse sidebar on mobile
  useEffect(() => {
    setIsCollapsed(!isMobile);
  }, [isMobile]);

  const closeSidebar = () => {
    setIsCollapsed(true);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen border-r bg-primary/50 transition-all duration-300 backdrop-blur-xl z-20",
        isCollapsed ? "w-16" : "w-64 absolute left-0 top-0 md:static"
      )}
    >
      {!isCollapsed && (
        <div
          onClick={() => setIsCollapsed(true)}
          className="md:hidden h-screen w-screen absolute top-0 left-0 -z-10"
        />
      )}
      <div className="flex h-14 items-center px-4 border-b">
        {!isCollapsed && <div className="font-semibold text-lg">Photo MRA</div>}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto", isCollapsed && "mx-auto")}
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      <nav className={cn("flex flex-1 flex-col gap-1 p-2 overflow-y-auto")}>
        {adminNavItems.map((item, index) => (
          <NavItem
            key={index}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isCollapsed={isCollapsed}
            onClick={closeSidebar}
          />
        ))}
      </nav>
    </div>
  );
};

export default AppSidebar;
