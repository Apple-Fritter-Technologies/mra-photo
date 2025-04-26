"use client";

import AppSidebar from "../components/layout/app-sidebar";
import AppHeader from "../components/layout/app-header";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { verifyUserToken, getAuthToken } from "@/lib/actions/user-action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/store/use-user";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { token, setToken, logout } = useUserStore();

  const checkAuthStatus = async () => {
    setIsCheckingAuth(true);

    try {
      const cookieToken = await getAuthToken();

      if (cookieToken && !token) {
        setToken(cookieToken);
      }

      const tokenToVerify = token || cookieToken;

      if (tokenToVerify) {
        const res = await verifyUserToken(tokenToVerify);

        if (res.authorized) {
          if (!token) {
            setToken(tokenToVerify);
          }
        } else {
          // Token is invalid
          toast.error("Session expired. Please log in again.");
          await logout();
          router.push("/login");
        }
      } else {
        // No token found anywhere
        toast.error("Authentication required. Please log in.");
        router.push("/login");
      }
    } catch (error) {
      console.error("Auth verification error:", error);
      toast.error("Authentication error. Please log in again.");
      await logout();
      router.push("/login");
    } finally {
      setIsCheckingAuth(false);
    }
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
