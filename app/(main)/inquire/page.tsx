"use client";

import ImageHeader from "@/components/image-header";
import React, { useState, useEffect, Suspense, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Link2, Loader2, UserIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { createBooking } from "@/lib/actions/booking-action";
import { Booking, Product } from "@/types/intrerface";
import { getProducts } from "@/lib/actions/product-action";

type FormState = {
  fullName: string;
  email: string;
  sessionType: string; // Will now store the session title
  sessionId: string; // Added to store the session ID
  date?: Date;
  preferredTime: string;
  referralSource: string;
  otherReferral: string;
  additionalInfo: string;
};

// Initial form state
const initialFormState: FormState = {
  fullName: "",
  email: "",
  sessionType: "",
  sessionId: "",
  date: undefined,
  preferredTime: "",
  referralSource: "",
  otherReferral: "",
  additionalInfo: "",
};

function InquireFormWithSearchParams() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const img = "/images/inquire-header.jpg";

  const [sessionData, setSessionData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Modify the fetchSessions function to handle date and time params
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await getProducts();

      if (res.error) {
        setError(true);
        toast.error("Error loading session types");
      } else {
        setSessionData(res);

        // Set default session with title instead of just ID
        if (res.length > 0) {
          const defaultSession = res[0];
          setFormState((prev) => ({
            ...prev,
            sessionType: defaultSession.title,
            sessionId: defaultSession.id, // Store ID separately for verification
          }));

          // Apply session from URL query param if available
          const sessionFromUrl = searchParams.get("package");
          if (sessionFromUrl) {
            const matchedSession = res.find(
              (s: { id: string }) => s.id === sessionFromUrl
            );
            if (matchedSession) {
              setFormState((prev) => ({
                ...prev,
                sessionType: matchedSession.title,
                sessionId: matchedSession.id,
              }));
            }
          }

          // Handle date from URL if provided
          const dateFromUrl = searchParams.get("date");
          if (dateFromUrl) {
            try {
              const parsedDate = new Date(dateFromUrl);
              // Validate that the date is in the future
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (parsedDate >= today) {
                setFormState((prev) => ({
                  ...prev,
                  date: parsedDate,
                }));
              } else {
                // If date is in the past, don't use it
                toast.error("Selected date must be in the future");
              }
            } catch (e) {
              // If date parsing fails, ignore it
              console.error("Invalid date format in URL parameters");
            }
          }

          // Handle time from URL if provided
          const timeFromUrl = searchParams.get("time");
          if (
            timeFromUrl &&
            ["morning", "afternoon", "evening"].includes(timeFromUrl)
          ) {
            setFormState((prev) => ({
              ...prev,
              preferredTime: timeFromUrl,
            }));
          }
        }
      }
    } catch (error: unknown) {
      setError(true);
      toast.error("Couldn't load session types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [searchParams]);

  // Generic update handler for all form fields
  const updateFormField = <T extends keyof FormState>(
    field: T,
    value: FormState[T]
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  // Validate form whenever required fields change
  useEffect(() => {
    const { fullName, email, sessionId } = formState;
    setIsFormValid(
      fullName.trim() !== "" &&
        email.trim() !== "" &&
        /^\S+@\S+\.\S+$/.test(email) &&
        sessionId !== ""
    );
  }, [formState.fullName, formState.email, formState.sessionId]);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      const submissionData: Booking = {
        id: formState.sessionId,
        name: formState.fullName,
        email: formState.email,
        session_name: formState.sessionType,
        product_id: formState.sessionId,
        status: "pending",
        date: formState.date || new Date(),
        time: formState.preferredTime || "Any time",
        heard_from: formState.referralSource,
        message: formState.additionalInfo,
        // If otherReferral is provided and referralSource is 'other', add it to message
        ...(formState.otherReferral &&
          formState.referralSource === "other" && {
            message: `${formState.additionalInfo || ""}\n\nReferral Source: ${
              formState.otherReferral
            }`,
          }),
      };

      const res = await createBooking(submissionData);

      if (res.error) {
        toast.error(res.error, {
          description: "Please try again later.",
        });
      } else {
        toast.success("Booking request submitted!", {
          description: "We'll be in touch with you soon!",
        });
        setFormState(initialFormState);
      }
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate completion percentage for progress bar
  const completionPercentage = () => {
    const requiredFields = [
      formState.fullName,
      formState.email,
      formState.sessionType,
    ];
    const filledFields = requiredFields.filter(Boolean).length;
    return (filledFields / requiredFields.length) * 100;
  };

  return (
    <div className="container mx-auto px-4 flex flex-col gap-6 pb-16">
      <ImageHeader img={img} title="Book a Session" />

      <div className="max-w-5xl mx-auto w-full">
        <p className="text-2xl text-center my-8 font-primary leading-relaxed">
          Ready to capture your special moments? Fill out this form and
          let&apos;s create
          <span className="text-secondary font-semibold">
            {" "}
            beautiful memories together!
          </span>
        </p>

        <Card className="border-secondary/20 shadow-xl rounded-xl overflow-hidden bg-gradient-to-r from-secondary/10 to-secondary/5 p-3">
          <CardContent className="p-6 bg-white rounded-lg">
            <div className="w-full bg-gray-100 h-1 rounded-full mb-8">
              <div
                className="bg-secondary h-1 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${completionPercentage().toFixed(0)}%` }}
              />
            </div>
            <form className="space-y-10" onSubmit={handleFormSubmit}>
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-secondary/20 pb-2">
                  <div className="bg-secondary/10 rounded-full p-2">
                    <UserIcon className="h-5 w-5 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold font-title text-secondary">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-lg flex items-center"
                    >
                      Full Name <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      className="border-secondary/30 focus-visible:ring-secondary rounded-md px-4 py-3 transition-all hover:border-secondary/50"
                      value={formState.fullName}
                      onChange={(e) =>
                        updateFormField("fullName", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-lg flex items-center"
                    >
                      Email Address <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="border-secondary/30 focus-visible:ring-secondary/30"
                      value={formState.email}
                      onChange={(e) => updateFormField("email", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {loading && (
                  <div className="flex justify-center items-center py-12 gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                    <p className="text-secondary">Loading session options...</p>
                  </div>
                )}

                {error && (
                  <div className="text-red-500 text-center py-4 bg-muted/50 rounded-lg">
                    <p>Error fetching products. Please try again.</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={fetchSessions}
                    >
                      Retry
                    </Button>
                  </div>
                )}

                {!loading && !error && sessionData.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold font-title text-secondary">
                      Session Details
                    </h3>

                    <div className="space-y-2">
                      <Label className="text-lg flex items-center">
                        Session Type{" "}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <RadioGroup
                        value={formState.sessionId} // Use sessionId for selection value
                        onValueChange={(value) => {
                          // Find the selected session and update both ID and title
                          const selectedSession = sessionData.find(
                            (s) => s.id === value
                          );
                          if (selectedSession) {
                            updateFormField("sessionId", value);
                            updateFormField(
                              "sessionType",
                              selectedSession.title
                            );
                          }
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
                        required
                      >
                        {sessionData.map((session) => (
                          <Label
                            key={session.id}
                            className={`flex items-center space-x-2 p-3 rounded-lg transition-all border ${
                              formState.sessionId === session.id
                                ? "border-secondary bg-secondary/5"
                                : "border-gray-200 hover:border-secondary/30"
                            }`}
                            htmlFor={session.id}
                          >
                            <RadioGroupItem
                              value={session.id}
                              id={session.id}
                              className="text-secondary"
                              required
                            />
                            {session.title}

                            <Button
                              variant="ghost"
                              className="ml-auto text-secondary hover:text-secondary/80"
                              onClick={() => {
                                router.push(`/investment/${session.id}`);
                              }}
                            >
                              <Link2 className="h-4 w-4 text-secondary" />
                            </Button>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-lg">
                      Preferred Date{" "}
                      <span className="text-muted-foreground text-xs">
                        (Optional)
                      </span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-secondary/30 focus-visible:ring-secondary/30",
                            !formState.date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formState.date
                            ? format(formState.date, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formState.date}
                          onSelect={(date) => updateFormField("date", date)}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                          className="text-secondary"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredTime" className="text-lg">
                      Preferred Time{" "}
                      <span className="text-muted-foreground text-xs">
                        (Optional)
                      </span>
                    </Label>
                    <Select
                      value={formState.preferredTime}
                      onValueChange={(value) =>
                        updateFormField("preferredTime", value)
                      }
                    >
                      <SelectTrigger className="border-secondary/30 focus:ring-secondary">
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">
                          Morning (8am - 12pm)
                        </SelectItem>
                        <SelectItem value="afternoon">
                          Afternoon (12pm - 4pm)
                        </SelectItem>
                        <SelectItem value="evening">
                          Evening (Golden Hour)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referralSource" className="text-lg">
                    How did you hear about us?{" "}
                    <span className="text-muted-foreground text-xs">
                      (Optional)
                    </span>
                  </Label>
                  <Select
                    value={formState.referralSource}
                    onValueChange={(value) =>
                      updateFormField("referralSource", value)
                    }
                  >
                    <SelectTrigger className="border-secondary/30 focus:ring-secondary">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="search">Search Engine</SelectItem>
                      <SelectItem value="referral">
                        Friend/Family Referral
                      </SelectItem>
                      <SelectItem value="repeat">Repeat Client</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  {formState.referralSource === "other" && (
                    <div className="mt-2">
                      <Input
                        placeholder="Please specify how you heard about us..."
                        className="border-secondary/30 focus-visible:ring-secondary/30"
                        value={formState.otherReferral}
                        onChange={(e) =>
                          updateFormField("otherReferral", e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo" className="text-lg">
                    Additional Information{" "}
                    <span className="text-muted-foreground text-xs">
                      (Optional)
                    </span>
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Tell us more about what you're looking for in your session..."
                    className="min-h-[120px] border-secondary/30 focus-visible:ring-secondary/30"
                    value={formState.additionalInfo}
                    onChange={(e) =>
                      updateFormField("additionalInfo", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting || loading}
                  className={cn(
                    "border-red-500 bg-secondary text-white font-bold py-6 px-12 text-lg transition-all duration-200 rounded-lg hover:scale-105 active:scale-95",
                    !isFormValid || isSubmitting || loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-secondary/90 shadow-lg hover:shadow-secondary/20"
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></span>
                      Processing...
                    </span>
                  ) : loading ? (
                    "Loading options..."
                  ) : (
                    "Submit Inquiry"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
const InquirePage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        </div>
      }
    >
      <InquireFormWithSearchParams />
    </Suspense>
  );
};

export default InquirePage;
