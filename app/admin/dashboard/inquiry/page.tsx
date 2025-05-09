"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, RefreshCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import BookingModal from "../../components/booking-modal";
import { fetchBookings } from "@/lib/actions/booking-action";
import { Booking } from "@/types/intrerface";

// Define status colors with proper typing
type StatusColorMap = {
  pending: string;
  confirmed: string;
  completed: string;
  cancelled: string;
};

const statusColors: StatusColorMap = {
  pending: "bg-yellow-200 text-yellow-800",
  confirmed: "bg-green-200 text-green-800",
  completed: "bg-blue-200 text-blue-800",
  cancelled: "bg-red-200 text-red-800",
};

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch bookings
  const getBookings = async () => {
    setLoading(true);
    try {
      const res = await fetchBookings();

      if (res.error) {
        setError(true);
        toast.error(res.error);
      } else {
        setBookings(res);
      }
    } catch (error: unknown) {
      setError(true);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  // Refresh bookings
  const refreshBookings = async () => {
    setRefreshing(true);
    try {
      await getBookings();
      toast.success("Bookings refreshed");
    } catch (error: unknown) {
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  // Handle viewing booking details
  const handleViewBooking = (booking: Booking) => {
    setCurrentBooking(booking);
    setOpen(true);
  };

  // Filter bookings based on search term
  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchTerm.toLowerCase();

    return (
      booking.name?.toLowerCase().includes(searchLower) ||
      booking.email?.toLowerCase().includes(searchLower) ||
      booking.session_name?.toLowerCase().includes(searchLower) ||
      booking.status?.toLowerCase().includes(searchLower)
    );
  });

  // Format date for display
  const formatBookingDate = (dateString: string | Date) => {
    try {
      return format(
        typeof dateString === "string" ? new Date(dateString) : dateString,
        "MMM d, yyyy"
      );
    } catch (error: unknown) {
      return "Invalid date";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-2 z-10 backdrop-blur-xl bg-background/50 rounded-lg border border-white/10 p-4">
        <h1 className="text-2xl font-bold">Booking Management</h1>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:min-w-[300px]">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={refreshBookings}
            disabled={refreshing || loading}
          >
            <RefreshCcw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        <BookingModal
          open={open}
          setOpen={setOpen}
          bookingData={currentBooking || ({} as Booking)}
          refreshBookings={getBookings}
        />
      </div>

      {error && (
        <div className="text-red-500 text-center py-4 bg-muted/50 rounded-lg">
          <p>Error fetching bookings. Please try again.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setError(false);
              getBookings();
            }}
          >
            Retry
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && !error && bookings.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-medium">No bookings yet</h3>
          <p className="text-sm text-muted-foreground mt-2">
            When clients make bookings, they will appear here
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">
                  Date & Time
                </th>
                <th className="text-left p-4 font-medium hidden lg:table-cell">
                  Session
                </th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{booking.name}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {booking.email}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div>
                      <p>
                        {booking.date ? formatBookingDate(booking.date) : "N/A"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.time || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div>
                      <p className="truncate max-w-[200px]">
                        {booking.session_name || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      className={
                        statusColors[
                          booking.status as keyof typeof statusColors
                        ] || "bg-gray-100"
                      }
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewBooking(booking);
                      }}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && filteredBookings.length === 0 && searchTerm && (
        <div className="text-center py-8 bg-muted/30 rounded-lg">
          <p>No bookings found matching &quot;{searchTerm}&quot;</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setSearchTerm("")}
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
