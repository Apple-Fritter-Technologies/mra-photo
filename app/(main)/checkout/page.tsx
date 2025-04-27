"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  Loader2,
  ArrowLeft,
  Clock,
  Image as ImageIcon,
  CalendarClock,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";

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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/store/use-user";

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
  const { user } = useUserStore();

  const packageId = searchParams.get("package");
  const dateParam = searchParams.get("date");
  const timeParam = searchParams.get("time");

  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
  });
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "success" | "error"
  >("pending");

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

  // Check user authentication
  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        toast.error("Please log in to continue with checkout", {
          description: "You must be logged in to complete a booking",
        });
        router.push("/login?redirect=/checkout");
        return;
      }
    };

    checkAuth();
  }, [user, router]);

  // Get session data from URL parameters or localStorage
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        setLoading(true);

        if (!packageId || !dateParam || !timeParam) {
          // Try to recover from localStorage if URL params are missing
          const savedSession = localStorage.getItem("pendingBooking");

          if (savedSession) {
            const parsedSession = JSON.parse(savedSession);
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
          // Create session from URL parameters
          const sessionData = {
            packageId: packageId,
            date: new Date(dateParam),
            time: timeParam,
          };

          // Load product details
          await fetchProductDetails(packageId);
        }
      } catch (error) {
        console.error("Error loading session data:", error);
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    loadSessionData();
  }, [packageId, dateParam, timeParam, router]);

  const fetchProductDetails = async (id: string) => {
    try {
      // This would be replaced with your actual API call
      const response = await getProducts();

      const foundProduct = response.find((p: Product) => p.id === id);

      if (!foundProduct) {
        toast.error("Product not found");
        router.push("/investment");
        return;
      }

      setProduct(foundProduct);

      // Update session with product details
      setSession((prev) =>
        prev
          ? {
              ...prev,
              packageId: foundProduct.id,
              packageName: foundProduct.title,
              price: foundProduct.price,
            }
          : {
              packageId: foundProduct.id,
              packageName: foundProduct.title,
              price: foundProduct.price,
              date: dateParam ? new Date(dateParam) : new Date(),
              time: timeParam || "morning",
            }
      );
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load package details");
    }
  };

  // Mock function to get products (replace with actual API call)
  const getProducts = async () => {
    // This would be your actual API endpoint
    try {
      const response = await axios.get("/api/products");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return [];
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
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

    setProcessing(true);
    setPaymentStatus("processing");

    try {
      // Create payment through your API
      const paymentResponse = await axios.post("/api/payments", {
        sourceId: token.token,
        amount: product.price,
        currency: "USD",
        productId: product.id,
        productName: product.title,
        date: session.date,
        time: session.time,
        customerInfo,
        userId: user.id, // Include the user ID
      });

      if (paymentResponse.data.success) {
        setPaymentStatus("success");

        // Create booking record with updated fields
        await axios.post("/api/bookings", {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          note: customerInfo.note,
          date: session.date,
          time: session.time,
          product_id: product.id,
          session_name: product.title,
          user_id: user.id, // Include the user ID
        });

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
            `/booking-confirmation?id=${paymentResponse.data.orderId}`
          );
        }, 2000);
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      setPaymentStatus("error");
      toast.error("Payment processing failed", {
        description: "Please try again or contact support",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

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
            We couldn't find the details for your photography session.
          </p>
          <Button onClick={() => router.push("/investment")}>
            Browse Photography Packages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container min-h-[80vh] max-w-6xl mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2"
        onClick={handleGoBack}
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
                    disabled={!!user} // Disable if user is logged in
                    className={user ? "bg-gray-50" : ""}
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
                    disabled={!!user} // Disable if user is logged in
                    className={user ? "bg-gray-50" : ""}
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
                    onChange={handleInputChange}
                    required
                  />
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
              ) : (
                <PaymentForm
                  applicationId={process.env.SQUARE_APPLICATION_ID || ""}
                  locationId={process.env.SQUARE_LOCATION_ID || ""}
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
                  <AccordionTrigger>What's Included</AccordionTrigger>
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
