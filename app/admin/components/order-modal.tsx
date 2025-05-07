import React, { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Order } from "@/types/intrerface";
import { deleteOrder, updateOrder } from "@/lib/actions/orders-action";
import {
  Trash2,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CreditCard,
  Tag,
  DollarSign,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusOptions } from "@/lib/data";

// Helper functions
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPaymentStatusBadgeColor = (status: string) => {
  // payment status: APPROVED, PENDING, COMPLETED, CANCELED, or FAILED

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

interface OrderModalProps {
  isUpdateDialogOpen: boolean;
  setIsUpdateDialogOpen: (value: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (value: boolean) => void;
  currentOrder: Order | null;
  fetchOrders: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({
  isUpdateDialogOpen,
  setIsUpdateDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  currentOrder,
  fetchOrders,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState("");

  // Check if status has been changed
  const hasStatusChanged = useMemo(() => {
    if (!currentOrder) return false;
    return updatedStatus !== currentOrder.order_status;
  }, [updatedStatus, currentOrder]);

  // Set initial values when currentOrder changes
  useEffect(() => {
    if (currentOrder) {
      setUpdatedStatus(currentOrder.order_status);
    }
  }, [currentOrder]);

  // Update order status
  const handleSubmitUpdate = async () => {
    if (!currentOrder || !hasStatusChanged) return;

    setIsLoading(true);

    try {
      const result = await updateOrder(currentOrder.id, {
        order_status: updatedStatus,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Order status updated successfully");
        fetchOrders();
        handleClose();
      }
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setIsUpdateDialogOpen(false);
      setIsLoading(false);
    }
  };

  // Delete order
  const handleDeleteOrder = async () => {
    if (!currentOrder) return;

    setIsLoading(true);

    try {
      const result = await deleteOrder(currentOrder.id);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Order deleted successfully");
        fetchOrders();
        handleClose();
      }
    } catch (error) {
      toast.error("Failed to delete order");
    } finally {
      setIsDeleteDialogOpen(false);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsUpdateDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setIsLoading(false);
    setUpdatedStatus("");
  };

  if (!currentOrder) return null;

  return (
    <>
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-lg md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Order ID: {currentOrder.id}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Order Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Order Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Date
                    </Label>
                    <p>
                      {format(new Date(currentOrder.date), "MMMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Time
                    </Label>
                    <p>{currentOrder.time}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Name
                    </Label>
                    <p>{currentOrder.user_name || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Email
                    </Label>
                    <p>{currentOrder.user_email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Phone
                    </Label>
                    <p>{currentOrder.User?.phone || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Service Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Service
                    </Label>
                    <p>{currentOrder.product_title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Price
                    </Label>
                    <p>
                      {formatCurrency(
                        Number(currentOrder.paid_amount) / 100,
                        currentOrder.currency
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Payment Status
                    </Label>
                    <Badge
                      className={getPaymentStatusBadgeColor(
                        currentOrder.payment_status || "pending"
                      )}
                    >
                      {(currentOrder.payment_status || "pending")
                        .charAt(0)
                        .toUpperCase() +
                        (currentOrder.payment_status || "pending").slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Current Order Status
                    </Label>
                    <Badge
                      className={getStatusBadgeColor(currentOrder.order_status)}
                    >
                      {currentOrder.order_status.charAt(0).toUpperCase() +
                        currentOrder.order_status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status - Only editable field */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Update Order Status
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order-status">New Status</Label>
                  <Select
                    value={updatedStatus}
                    onValueChange={setUpdatedStatus}
                  >
                    <SelectTrigger
                      id="order-status"
                      className={getStatusBadgeColor(updatedStatus)}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {OrderStatusOptions.map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          className={getStatusBadgeColor(status)}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {!hasStatusChanged && (
                  <p className="text-xs text-muted-foreground">
                    Change the status to enable the update button
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            {currentOrder.note && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Additional Notes
                </h3>
                <p className="text-sm bg-muted p-3 rounded-md italic">
                  {currentOrder.note}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between gap-2 w-full">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isLoading}
              className="mr-auto bg-red-500 hover:bg-red-600"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete Order
            </Button>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsUpdateDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitUpdate}
                disabled={!hasStatusChanged || isLoading}
                className={
                  hasStatusChanged ? getStatusBadgeColor(updatedStatus) : ""
                }
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Update Status
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Order Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the order. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrder}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrderModal;
