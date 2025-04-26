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

import { Loader2, User, Phone, LogOut, Lock, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/store/use-user";
import {
  getAuthToken,
  updateUser,
  verifyUserToken,
} from "@/lib/actions/user-action";
import ForgotPasswordModal from "@/components/forgot-password-modal";

const AccountPage = () => {
  const router = useRouter();
  const { token, logout, user, setUser, setToken } = useUserStore();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Current values
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Original values for comparison
  const [originalName, setOriginalName] = useState("");
  const [originalPhone, setOriginalPhone] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  useEffect(() => {
    if (user) {
      // Set both current and original values
      setName(user.name || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");

      setOriginalName(user.name || "");
      setOriginalPhone(user.phone || "");
      setOriginalEmail(user.email || "");
    }
  }, [user]);

  // Check if any values have changed
  const hasChanges = () => {
    return (
      name !== originalName ||
      phone !== originalPhone ||
      email !== originalEmail
    );
  };

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
          setUser(res.user);
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

  // Phone number validation function
  const isValidPhoneNumber = (phone: string): boolean => {
    // Remove any non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, "");

    // Check if the resulting string has a valid length of 10 to 15 digits
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  };

  // Format phone input to allow only numbers
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-digit characters from input
    const formattedPhone = e.target.value.replace(/\D/g, "");
    setPhone(formattedPhone);
  };

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("User ID not found");
      await logout();
      router.push("/login");
      return;
    }

    // Validate email before updating
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate phone number if provided
    if (phone && !isValidPhoneNumber(phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsSaving(true);

    try {
      const result = await updateUser(user.id, {
        name,
        phone,
        email,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Profile updated successfully");
        setUser({
          ...user,
          phone,
          name,
          email,
        });

        // Update original values after successful save
        setOriginalName(name);
        setOriginalPhone(phone);
        setOriginalEmail(email);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-slate-500 dark:text-slate-400">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 md:px-6 lg:py-12 min-h-[80vh]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Account</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/orders")}
            className="flex items-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>View My Orders</span>
          </Button>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account details here.</CardDescription>
          </CardHeader>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Changing your email may require verification
                </p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="name"
                    name="name"
                    className="pl-10"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Phone number input field */}
              <div className="space-y-1">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="phone"
                    name="phone"
                    className="pl-10"
                    placeholder="Your phone number"
                    value={phone}
                    onChange={handlePhoneChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter digits only (e.g., 1234567890)
                </p>
              </div>

              <div className="space-y-1 pt-4">
                <Label>Password</Label>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-slate-500" />
                    <span className="text-sm text-slate-500">••••••••</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setForgotPasswordOpen(true)}
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </CardContent>

            {hasChanges() && (
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            )}
          </form>
        </Card>

        <div className="flex justify-end">
          <Button
            variant="outline"
            type="button"
            onClick={handleLogout}
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        initialEmail={user?.email || ""}
      />
    </div>
  );
};

export default AccountPage;
