"use client";

import ImageHeader from "@/components/image-header";
import React, { useState, useEffect } from "react";
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
import { CalendarIcon, UserIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { sessionData } from "@/lib/data";
import { toast } from "sonner";

type FormState = {
  fullName: string;
  email: string;
  sessionType: string;
  date?: Date;
  preferredTime: string;
  referralSource: string;
  otherReferral: string;
  additionalInfo: string;
};

const InquirePage = () => {
  const img = "/images/inquire-header.jpg";

  const [formState, setFormState] = useState<FormState>({
    fullName: "",
    email: "",
    sessionType: "lifestyle",
    date: undefined,
    preferredTime: "",
    referralSource: "",
    otherReferral: "",
    additionalInfo: "",
  });

  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Generic update handler for all form fields
  const updateFormField = (field: keyof FormState, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validate form whenever required fields change
  useEffect(() => {
    const { fullName, email, sessionType } = formState;
    const isValid =
      fullName.trim() !== "" &&
      email.trim() !== "" &&
      /^\S+@\S+\.\S+$/.test(email) &&
      sessionType !== "";

    setIsFormValid(isValid);
  }, [formState.fullName, formState.email, formState.sessionType]);

  const resetForm = () => {
    setFormState({
      fullName: "",
      email: "",
      sessionType: "lifestyle",
      date: undefined,
      preferredTime: "",
      referralSource: "",
      otherReferral: "",
      additionalInfo: "",
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isFormValid) {
      setIsSubmitting(true);

      try {
        // Format data for submission
        const submissionData = {
          ...formState,
          preferredDate: formState.date ? format(formState.date, "PPP") : null,
        };

        // Log form data to console
        console.log("Form submitted with data:", submissionData);

        // Simulate API call with timeout
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Show success toast
        toast.success("Form submitted successfully!", {
          description: "We'll be in touch with you soon!",
          duration: 5000,
        });

        // Reset form after successful submission
        resetForm();
      } catch (error) {
        toast.error("Something went wrong", {
          description: "Please try again later.",
        });
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 flex flex-col gap-6 pb-16">
      <ImageHeader img={img} title="Book a Session" />

      <div className="max-w-5xl mx-auto w-full">
        <p className="text-2xl text-center my-8 font-primary leading-relaxed">
          Ready to capture your special moments? Fill out this form and let's
          create
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
                style={{
                  width: `${(
                    ([
                      formState.fullName,
                      formState.email,
                      formState.sessionType,
                    ].filter(Boolean).length /
                      3) *
                    100
                  ).toFixed(0)}%`,
                }}
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
                <h3 className="text-3xl font-bold font-title text-secondary">
                  Session Details
                </h3>

                <div className="space-y-2">
                  <Label className="text-lg flex items-center">
                    Session Type <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <RadioGroup
                    value={formState.sessionType}
                    onValueChange={(value) =>
                      updateFormField("sessionType", value)
                    }
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
                    required
                  >
                    {sessionData.map((type) => (
                      <Label
                        key={type}
                        className={`flex items-center space-x-2 p-3 rounded-lg transition-all border ${
                          formState.sessionType ===
                          type.toLowerCase().replace(/\s+/g, "-")
                            ? "border-secondary bg-secondary/5"
                            : "border-gray-200 hover:border-secondary/30"
                        }`}
                        htmlFor={type.toLowerCase().replace(/\s+/g, "-")}
                      >
                        <RadioGroupItem
                          value={type.toLowerCase().replace(/\s+/g, "-")}
                          id={type.toLowerCase().replace(/\s+/g, "-")}
                          className="text-secondary"
                          required
                        />
                        {type}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

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
                  disabled={!isFormValid || isSubmitting}
                  className={cn(
                    "border-red-500 bg-secondary text-white font-bold py-6 px-12 text-lg transition-all duration-200 rounded-lg hover:scale-105 active:scale-95",
                    !isFormValid || isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-secondary/90 shadow-lg hover:shadow-secondary/20"
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></span>
                      Processing...
                    </span>
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
};

export default InquirePage;
