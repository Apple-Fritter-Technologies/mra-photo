"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Check, Eye, EyeOff, FileWarning, Loader2 } from "lucide-react";
import { verifyResetToken, resetPassword } from "@/lib/actions/user-action";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define form schema with Zod
const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const validateToken = async () => {
    if (!token) {
      setIsTokenValid(false);
      setIsLoading(false);
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    try {
      const response = await verifyResetToken(token);

      if (!response.valid) {
        setIsTokenValid(false);
        setIsLoading(false);
        setError("Invalid or expired link");
        toast.error(
          "Invalid or expired link. Please request a new password reset link."
        );
        setTimeout(() => router.push("/login"), 3000);
        return;
      }

      setIsTokenValid(response.valid);
      setIsLoading(false);
    } catch (error) {
      setIsTokenValid(false);
      setIsLoading(false);
      setTimeout(() => router.push("/login"), 3000);
    }
  };

  // Validate token on page load
  useEffect(() => {
    validateToken();
  }, [token]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const response = await resetPassword(token!, values.password);

      if (response.error) {
        setError(response.error);
        toast.error(response.error);
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      toast.success("Password reset successful. Redirecting to login...");
      setTimeout(() => router.push("/login"), 3000);
    } catch (error) {
      setError("Failed to reset password. Please try again.");
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading && !success) {
    return (
      <div className="container max-w-md mx-auto min-h-[70vh] flex flex-col items-center justify-center p-4">
        <Card className="w-full">
          <CardHeader className="flex flex-col gap-2 items-center text-center">
            <Loader2 className="animate-spin text-secondary h-8 w-8 mb-2" />
            <CardTitle>Verifying Your Link</CardTitle>
            <CardDescription>
              Please wait while we verify your reset link...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Invalid token or no token
  if (!isTokenValid) {
    return (
      <div className="container max-w-md mx-auto min-h-[70vh] flex flex-col items-center justify-center p-4">
        <Card className="w-full border-red-100">
          <CardHeader className="flex flex-col gap-2 items-center text-center">
            <FileWarning className="text-red-500 h-10 w-10 mb-2" />
            <CardTitle>Invalid or Expired Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired. Reset links
              are valid for 1 hour.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Success message
  if (success) {
    return (
      <div className="container max-w-md mx-auto min-h-[70vh] flex flex-col items-center justify-center p-4">
        <Card className="w-full border-green-100">
          <CardHeader className="flex flex-col gap-2 items-center text-center">
            <div className="rounded-full bg-green-100 p-3 inline-flex mb-2">
              <Check className="text-green-500 h-8 w-8" />
            </div>
            <CardTitle>Password Reset Successful</CardTitle>
            <CardDescription>
              Your password has been successfully changed. You&apos;ll be
              redirected to login shortly.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="container max-w-md mx-auto min-h-[70vh] flex flex-col items-center justify-center p-4">
      <Card className="w-full">
        <CardHeader className="flex flex-col gap-2 items-center text-center">
          <div className="h-16 w-16 relative mb-2">
            <Image
              src="/images/logo.png"
              alt="Photography MRA"
              fill
              className="object-contain"
            />
          </div>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Please enter your new password below
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          {...field}
                          disabled={isLoading}
                          className="pr-10"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          {...field}
                          disabled={isLoading}
                          className="pr-10"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showConfirmPassword
                            ? "Hide password"
                            : "Show password"}
                        </span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button variant="ghost" asChild>
            <Link href="/login">Return to login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
