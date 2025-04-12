"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Trash, Calendar, Clock } from "lucide-react";
import { updateBooking, deleteBooking } from "@/lib/actions/booking-action";
import { format } from "date-fns";
import { BookingStatusOptions } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Booking } from "@/types/intrerface";

// Define a proper Booking interface

interface BookingModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  bookingData: Booking;
  refreshBookings: () => Promise<void>;
}

const BookingModal = ({
  open,
  setOpen,
  bookingData,
  refreshBookings,
}: BookingModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booking, setBooking] = useState<Booking>({
    id: "",
    name: "",
    email: "",
    date: new Date(),
    time: "",
    status: "pending",
    product_id: "",
    session_name: "",
    heard_from: "",
    message: "",
  });

  useEffect(() => {
    if (open && bookingData) {
      setBooking({
        ...bookingData,
        date: bookingData.date ? new Date(bookingData.date) : new Date(),
      });
    }
  }, [open, bookingData]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleStatusUpdate = async () => {
    if (!booking.id) {
      toast.error("Booking ID is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await updateBooking({
        id: booking.id,
        status: booking.status,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Booking status updated successfully");
        await refreshBookings();
        handleClose();
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!booking.id) {
      toast.error("Booking ID is required");
      return;
    }

    if (!confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await deleteBooking(booking.id);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Booking deleted successfully");
        handleClose();
        await refreshBookings();
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObject = date instanceof Date ? date : new Date(date);
      return format(dateObject, "MMMM d, yyyy");
    } catch (error: unknown) {
      console.error("Error formatting date:", error);
      return String(date);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            Review and manage booking information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={booking.status}
              onValueChange={(value) =>
                setBooking({ ...booking, status: value })
              }
            >
              <SelectTrigger
                id="status"
                className={cn(
                  "w-full",
                  booking.status === "pending" && "bg-yellow-200",
                  booking.status === "confirmed" && "bg-green-200",
                  booking.status === "cancelled" && "bg-red-200",
                  booking.status === "completed" && "bg-blue-200"
                )}
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {BookingStatusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <div className="p-2 bg-gray-50 rounded-md border">
                {booking.name}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <div className="p-2 bg-gray-50 rounded-md border truncate">
                {booking.email}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Date
              </Label>
              <div className="p-2 bg-gray-50 rounded-md border">
                {booking.date ? formatDate(booking.date) : "Not specified"}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> Time
              </Label>
              <div className="p-2 bg-gray-50 rounded-md border">
                {booking.time || "Not specified"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Session Name</Label>
              <div className="p-2 bg-gray-50 rounded-md border">
                {booking.session_name || "Not specified"}
              </div>
            </div>

            <div className="space-y-2">
              <Label>How They Heard</Label>
              <div className="p-2 bg-gray-50 rounded-md border">
                {booking.heard_from || "Not specified"}
              </div>
            </div>
          </div>

          {booking.message && (
            <div className="space-y-2">
              <Label>Message</Label>
              <div className="p-2 bg-gray-50 rounded-md border min-h-[80px] whitespace-pre-wrap">
                {booking.message}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Created On</Label>
            <div className="p-2 bg-gray-50 rounded-md border">
              {booking.created_at
                ? format(
                    new Date(booking.created_at),
                    "MMMM d, yyyy 'at' h:mm a"
                  )
                : ""}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="mr-auto">
            <Button
              type="button"
              variant="ghost"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="hover:bg-red-500 hover:text-white"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4" />
              )}
              Delete Booking
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={handleStatusUpdate}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
