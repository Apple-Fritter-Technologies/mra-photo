"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Mail, Lock, Camera } from "lucide-react";
import { loginUser, verifyUserToken } from "@/lib/actions/user-action";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";

const DashboardLoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  const [token, setToken, removeToken] = useLocalStorage("token", "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    if (!email || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const res = await loginUser({ email, password });

      if (res.error) {
        setError(true);
        toast.error("Invalid email or password");
      } else {
        setToken(res.token);
        toast.success("Login successful!");
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError(true);
      toast.error("An error occurred while logging in", {
        description: "Please check your credentials and try again.",
        duration: 3000,
      });
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    setIsCheckingAuth(true);

    if (token) {
      try {
        const res = await verifyUserToken(token);

        if (res.authorized) {
          router.push("/admin/dashboard");
          return;
        } else {
          removeToken();

          if (res.error) {
            toast.error("Session expired", {
              description: res.error,
            });
          }
        }
      } catch (error) {
        console.error("Token verification error:", error);
        toast.error("Token verification failed. Please log in again.");
        removeToken();
      }
    }
    setIsCheckingAuth(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
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
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-3">
            <Camera className="h-8 w-8 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Photography MRA Admin
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Sign in to access your dashboard
          </p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-sm bg-white/50 dark:bg-slate-900/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Login</CardTitle>
            <CardDescription>
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert
                variant="destructive"
                className="border-red-500 text-red-500 bg-red-50"
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Invalid email or password. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full font-medium"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Protected area. Unauthorized access is prohibited.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DashboardLoginPage;
