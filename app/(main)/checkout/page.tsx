"use client";

import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarClock,
  Check,
  Clock,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  CreditCard,
  Divider,
  GooglePay,
  PaymentForm,
} from "react-square-web-payments-sdk";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createPayment } from "@/lib/actions/payment-action";
import { getProductById } from "@/lib/actions/product-action";
import { getAuthToken, verifyUserToken } from "@/lib/actions/user-action";
import { useUserStore } from "@/store/use-user";
import { PaymentData } from "@/types/intrerface";

// Types
interface CheckoutSession {
  packageId: string;
  packageName: string;
  price: number;
  date: Date;
  time: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  duration: string;
  photos: string;
  image_url: string;
  description?: string;
}

const CheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, setToken, logout, user } = useUserStore();

  const packageId = searchParams.get("package");
  const dateParam = searchParams.get("date");
  const timeParam = searchParams.get("time");

  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
  });
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "success" | "error"
  >("pending");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // set customer info from user store
  useEffect(() => {
    if (user) {
      setCustomerInfo({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        note: "",
      });
    }
  }, [user]);

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

  // Get session data from URL parameters or localStorage
  const loadSessionData = async () => {
    try {
      setLoading(true);

      if (!packageId || !dateParam || !timeParam) {
        // Try to recover from localStorage if URL params are missing
        const savedSession = localStorage.getItem("pendingBooking");

        if (savedSession) {
          const parsedSession = JSON.parse(savedSession);

          // Check if the session date is in the past
          const sessionDate = new Date(parsedSession.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset time to start of day

          if (sessionDate < today) {
            toast.error("Cannot book a session in the past", {
              description: "Please select a current or future date",
            });
            router.push("/investment");
            return;
          }

          setSession({
            ...parsedSession,
            date: new Date(parsedSession.date),
          });

          // Load product details
          await fetchProductDetails(parsedSession.packageId);
        } else {
          toast.error("Missing session details", {
            description: "Please select a package and date to proceed",
          });
          router.push("/investment");
          return;
        }
      } else {
        // Validate date from URL parameters
        const selectedDate = new Date(dateParam || "");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          toast.error("Cannot book a session in the past", {
            description: "Please select a current or future date",
          });
          router.push("/investment");
          return;
        }

        // Load product details
        await fetchProductDetails(packageId);
        const productDetails = await getProductById(packageId);
        setProduct(productDetails);
      }
    } catch (error) {
      console.error("Error loading session data:", error);
      toast.error("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessionData();
  }, []);

  const fetchProductDetails = async (id: string) => {
    try {
      // This would be replaced with your actual API call
      const res = await getProductById(id);

      if (res.error) {
        toast.error("Failed to load product details");
        return;
      }

      // Update session with product details
      setSession((prev) =>
        prev
          ? {
              ...prev,
              packageId: res.id,
              packageName: res.title,
              price: res.price,
            }
          : {
              packageId: res.id,
              packageName: res.title,
              price: res.price,
              date: dateParam ? new Date(dateParam) : new Date(),
              time: timeParam || "morning",
            }
      );
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load package details");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only allow digits for processing
    const digitsOnly = value.replace(/\D/g, "");

    // Format the phone number for display
    let formattedInput = "";

    if (digitsOnly.length <= 10) {
      // Format as (XXX) XXX-XXXX for US numbers
      if (digitsOnly.length > 3) {
        formattedInput += `(${digitsOnly.substring(0, 3)})`;
        if (digitsOnly.length > 6) {
          formattedInput += ` ${digitsOnly.substring(
            3,
            6
          )}-${digitsOnly.substring(6, 10)}`;
        } else {
          formattedInput += ` ${digitsOnly.substring(3, digitsOnly.length)}`;
        }
      } else if (digitsOnly.length > 0) {
        formattedInput += `(${digitsOnly}`;
      }
    } else {
      // Handle international numbers with country code
      const countryCode = digitsOnly.substring(0, digitsOnly.length - 10);
      const areaCode = digitsOnly.substring(
        digitsOnly.length - 10,
        digitsOnly.length - 7
      );
      const prefix = digitsOnly.substring(
        digitsOnly.length - 7,
        digitsOnly.length - 4
      );
      const lineNumber = digitsOnly.substring(digitsOnly.length - 4);

      formattedInput = `+${countryCode} (${areaCode}) ${prefix}-${lineNumber}`;
    }

    setCustomerInfo((prev) => ({
      ...prev,
      phone: formattedInput,
    }));
  };

  const handlePaymentSuccess = async (token: any) => {
    if (!session || !product) {
      toast.error("Missing session details");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to complete checkout");
      router.push("/login?redirect=/checkout");
      return;
    }

    if (!customerInfo.email) {
      toast.error("Please provide your email address");
      return;
    }

    // Check if the session date is in the past
    const sessionDate = new Date(session.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison

    if (sessionDate < today) {
      toast.error("Cannot book a session in the past", {
        description: "Please select a current or future date for your session",
      });
      return;
    }

    // Set processing state immediately to lock the UI
    setPaymentStatus("processing");

    // Add window listener to prevent navigation
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        "Your payment is processing. Are you sure you want to leave?";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    try {
      // Format the phone number to E.164 format
      let formattedPhone = customerInfo.phone;
      if (formattedPhone) {
        // Remove all non-digit characters
        formattedPhone = formattedPhone.replace(/\D/g, "");

        // Add +1 (US) prefix if it's a 10-digit number without country code
        if (formattedPhone.length === 10) {
          formattedPhone = "+1" + formattedPhone;
        } else if (
          formattedPhone.length > 10 &&
          !formattedPhone.startsWith("+")
        ) {
          formattedPhone = "+" + formattedPhone;
        }
      }

      const paymentData: PaymentData = {
        sourceId: token.token,
        amount: product.price * 100, // Amount in cents
        product: {
          id: product.id,
          title: product.title,
          price: product.price,
        },
        order: {
          date: session.date,
          time: session.time,
          order_status: "pending",
          note: customerInfo.note,
        },
        user: {
          id: user.id,
          email: customerInfo.email,
          name: customerInfo.name,
          phone: formattedPhone, // Use the formatted phone
        },
        currency: "USD",
      };

      // Create payment through your API
      const paymentResponse = await createPayment(paymentData);

      if (paymentResponse.success) {
        setPaymentStatus("success");

        // Clear the pending booking from localStorage
        localStorage.removeItem("pendingBooking");

        // Show success message
        toast.success("Booking confirmed!", {
          description:
            "Your payment was successful. Check your email for details.",
        });

        // Redirect to confirmation page after a short delay
        setTimeout(() => {
          router.push(
            `/booking-confirmation?id=${paymentResponse.order?.id || ""}`
          );
        }, 2000);
      } else {
        throw new Error(paymentResponse.error || "Payment failed");
      }
    } catch (error) {
      console.log("Payment processing error:", error);

      setPaymentStatus("error");
      toast.error("Payment processing failed", {
        description: "Please try again or contact support",
      });
    } finally {
      // Remove navigation prevention
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-secondary" />
      </div>
    );
  }

  if (!session || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold">Session Details Not Found</h1>
          <p className="text-gray-600">
            We couldn&apos;t find the details for your photography session.
          </p>
          <Button onClick={() => router.push("/investment")}>
            Browse Photography Packages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container min-h-[80vh] max-w-6xl mx-auto px-4 py-8 relative">
      {paymentStatus === "processing" && (
        <div className="fixed inset-0 bg-black/5 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h3 className="text-xl font-semibold">Processing Payment</h3>
                <p className="text-gray-600 text-center">
                  Please wait while we complete your transaction. Do not close
                  this page.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2"
        onClick={handleGoBack}
        disabled={paymentStatus === "processing"}
      >
        <ArrowLeft size={16} />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>
                Please provide your contact details for the booking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Jane Smith"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    required
                    disabled={!!user?.name || paymentStatus === "processing"}
                    className={
                      user || paymentStatus === "processing" ? "bg-gray-50" : ""
                    }
                  />
                  {user && (
                    <p className="text-xs text-muted-foreground">
                      Name is pre-filled from your account
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    required
                    disabled={!!user?.email || paymentStatus === "processing"}
                    className={
                      user || paymentStatus === "processing" ? "bg-gray-50" : ""
                    }
                  />
                  {user && (
                    <p className="text-xs text-muted-foreground">
                      Email is pre-filled from your account
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="(555) 123-4567"
                    value={customerInfo.phone}
                    onChange={handlePhoneChange}
                    required
                    disabled={!!user?.phone}
                  />
                  <p className="text-xs text-muted-foreground">
                    Please include area code (e.g., 555-123-4567)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Special Requests (Optional)</Label>
                  <Input
                    id="note"
                    name="note"
                    placeholder="Any special requests or information"
                    value={customerInfo.note || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                Secure payment processing by Square
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paymentStatus === "success" ? (
                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Payment Successful!</h3>
                  <p className="text-gray-600 text-center">
                    Your booking has been confirmed. Check your email for
                    details.
                  </p>
                </div>
              ) : paymentStatus === "processing" ? (
                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <h3 className="text-xl font-semibold">Processing Payment</h3>
                  <p className="text-gray-600 text-center">
                    Please wait while we complete your transaction. Do not close
                    this page.
                  </p>
                </div>
              ) : (
                <PaymentForm
                  applicationId={
                    process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || ""
                  }
                  locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || ""}
                  cardTokenizeResponseReceived={handlePaymentSuccess}
                  createPaymentRequest={() => ({
                    countryCode: "US",
                    currencyCode: "USD",
                    total: {
                      amount: product.price.toString(),
                      label: `${product.title} Photography Session`,
                    },
                  })}
                >
                  <CreditCard />
                  <Divider />
                  <GooglePay />
                </PaymentForm>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{product.title}</h3>

                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-4 w-4 text-secondary" />
                  <span>{product.duration}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <ImageIcon className="h-4 w-4 text-secondary" />
                  <span>{product.photos}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <CalendarClock className="h-4 w-4 text-secondary" />
                  <span>
                    {format(session.date, "MMMM d, yyyy")} -{" "}
                    {session.time === "morning"
                      ? "Morning (8am-12pm)"
                      : session.time === "afternoon"
                      ? "Afternoon (12pm-4pm)"
                      : "Evening (Golden Hour)"}
                  </span>
                </div>
              </div>

              <Separator />

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="whats-included">
                  <AccordionTrigger>What&apos;s Included</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-secondary mt-1 flex-shrink-0" />
                        <span>
                          Professional photography session ({product.duration})
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-secondary mt-1 flex-shrink-0" />
                        <span>
                          {product.photos} professionally edited digital images
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-secondary mt-1 flex-shrink-0" />
                        <span>
                          Online gallery for easy viewing and downloading
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-secondary mt-1 flex-shrink-0" />
                        <span>Print release for personal use</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${product.price}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${product.price}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-gray-500">
              <p>
                By completing this purchase, you agree to our terms of service
                and cancellation policy.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
