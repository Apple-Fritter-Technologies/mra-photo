"use client";

import AppSidebar from "../components/layout/app-sidebar";
import AppHeader from "../components/layout/app-header";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { verifyUserToken } from "@/lib/actions/user-action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [token, setToken, removeToken] = useLocalStorage("token", "");

  const checkAuthStatus = async () => {
    setIsCheckingAuth(true);

    if (token) {
      try {
        const res = await verifyUserToken(token);

        if (!res.authorized) {
          removeToken();
          toast.error("Session expired. Please log in again.");
          router.push("/admin/login");
        } else {
          setToken(token);
        }
      } catch (error) {
        console.error("Token verification error:", error);
        toast.error("Token verification failed. Please log in again.");
        removeToken();
      }
    } else {
      toast.error("Token not found. Please log in.");
      router.push("/admin/login");
    }
    setIsCheckingAuth(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-slate-500 dark:text-slate-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />

      <div className="flex-1 overflow-hidden flex flex-col">
        <AppHeader />
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-6 min-h-screen">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
