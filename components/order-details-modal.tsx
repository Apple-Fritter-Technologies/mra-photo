import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Tag,
  DollarSign,
  CreditCard,
  ExternalLink,
  MapPin,
  Info,
} from "lucide-react";
import { Order } from "@/types/intrerface";
import Link from "next/link";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!order) return null;

  // Helper function for status colors
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function for payment status colors
  const getPaymentStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "canceled":
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function for status descriptions
  const getStatusDescription = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Your booking is waiting to be confirmed by our photography team";
      case "processing":
        return "Your booking is confirmed and being prepared";
      case "completed":
        return "Your photography session has been completed";
      case "cancelled":
      case "canceled":
        return "This booking has been cancelled";
      default:
        return "Status information unavailable";
    }
  };

  // Helper function for payment status descriptions
  const getPaymentStatusDescription = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "Your payment has been approved and is being processed";
      case "pending":
        return "Your payment is pending confirmation";
      case "completed":
        return "Your payment has been successfully processed";
      case "canceled":
      case "failed":
        return "There was an issue with your payment";
      default:
        return "Payment status information unavailable";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lgq max-h-[90%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Your Photography Booking Details</DialogTitle>
          <DialogDescription>
            <span className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              Booking Reference: {order.id}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Session Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Photography Session
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-secondary" />
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Session Date
                  </Label>
                  <p className="font-medium">
                    {format(new Date(order.date), "MMMM dd, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-secondary" />
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Session Time
                  </Label>
                  <p className="font-medium">{order.time}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Your Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Your Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-secondary" />
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <p className="font-medium">{order.user_name || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-secondary" />
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="font-medium">{order.user_email}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Please contact us if any of your personal details need to be
              updated
            </p>
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Service Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href={`/investment/${order.product_id}`}
                target="_blank"
                className="flex items-center gap-2 border rounded-lg p-2 hover:bg-muted transition-colors"
              >
                <Tag className="h-4 w-4 text-secondary" />
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Photography Package
                  </Label>
                  <p className="font-medium">{order.product_title}</p>
                </div>
                <div className="ml-auto flex items-center text-xs text-secondary">
                  <ExternalLink className="h-3 w-3 ml-1" />
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-secondary" />
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Package Price
                  </Label>
                  <p className="font-medium">
                    {formatCurrency(
                      Number(order.paid_amount) / 100,
                      order.currency
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* address */}
          {order.address && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Your Address
              </h3>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-secondary" />
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Address
                  </Label>
                  <p className="font-medium">{order.address}</p>
                </div>
              </div>
            </div>
          )}

          {/* Status Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Booking Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-secondary" />
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Session Status
                    </Label>
                    <Badge className={getStatusBadgeColor(order.order_status)}>
                      {order.order_status.charAt(0).toUpperCase() +
                        order.order_status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {getStatusDescription(order.order_status)}
                </p>
              </div>

              <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-secondary" />
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Payment Status
                    </Label>
                    <Badge
                      className={getPaymentStatusBadgeColor(
                        order.payment_status || "pending"
                      )}
                    >
                      {(order.payment_status || "pending")
                        .charAt(0)
                        .toUpperCase() +
                        (order.payment_status || "pending").slice(1)}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {getPaymentStatusDescription(
                    order.payment_status || "pending"
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {order.note && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold border-b pb-2">
                Your Special Requests
              </h3>
              <p className="text-sm bg-slate-50 p-3 rounded-md">{order.note}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <div className="text-xs text-muted-foreground mb-2 sm:mb-0 sm:mr-auto">
            Need to make changes? Contact us at m.rose.a.photography@gmail.com
          </div>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
