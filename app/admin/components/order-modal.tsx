import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import { Trash2 } from "lucide-react";

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
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedPaymentStatus, setUpdatedPaymentStatus] = useState("");

  // Set initial values when currentOrder changes
  React.useEffect(() => {
    if (currentOrder) {
      setUpdatedStatus(currentOrder.order_status);
      setUpdatedPaymentStatus(currentOrder.payment_status || "");
    }
  }, [currentOrder]);

  // Update order status
  const handleSubmitUpdate = async () => {
    if (!currentOrder) return;

    try {
      const result = await updateOrder(currentOrder.id, {
        status: updatedStatus,
        payment_status: updatedPaymentStatus,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Order updated successfully");
        fetchOrders();
        handleClose();
      }
    } catch (error) {
      toast.error("Failed to update order");
    } finally {
      setIsUpdateDialogOpen(false);
    }
  };

  // Delete order
  const handleDeleteOrder = async () => {
    if (!currentOrder) return;

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
    }
  };

  const handleClose = () => {
    setIsUpdateDialogOpen(false);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of order {currentOrder?.id?.substring(0, 8)}...
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="order-status">Order Status</Label>
              <Select value={updatedStatus} onValueChange={setUpdatedStatus}>
                <SelectTrigger id="order-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-status">Payment Status</Label>
              <Select
                value={updatedPaymentStatus}
                onValueChange={setUpdatedPaymentStatus}
              >
                <SelectTrigger id="payment-status">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex justify-between gap-2 w-full">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="mr-auto bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsUpdateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitUpdate}>Save Changes</Button>
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
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrderModal;
