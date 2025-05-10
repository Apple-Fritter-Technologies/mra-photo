"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  Filter,
  Loader2,
  Pencil,
  RefreshCcw,
  Search,
  Calendar,
  User,
  Camera,
  CreditCard,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getOrders } from "@/lib/actions/orders-action";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/types/intrerface";
import OrderModal from "../../components/order-modal";

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

const OrdersPage = () => {
  // State variables
  const [allOrders, setAllOrders] = useState<Order[]>([]); // Store all orders
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]); // Store filtered orders
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Fetch all orders from API once
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await getOrders();

      if (response.error) {
        setError(true);
        toast.error(response.error);
        return;
      }

      setAllOrders(response);
      applyFilters(response, searchTerm, statusFilter);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(true);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply filters to the orders without making new API calls
  const applyFilters = useCallback(
    (orders: Order[], search: string, status: string) => {
      let result = [...orders];

      if (search) {
        const searching = search.toLowerCase();

        result = result.filter(
          (order: Order) =>
            order.id.toLowerCase().includes(searching) ||
            order.user_email?.toLowerCase().includes(searching) ||
            order.user_name?.toLowerCase().includes(searching) ||
            order.product_title?.toLowerCase().includes(searching) ||
            order.time.toLowerCase().includes(searching) ||
            String(order.paid_amount).includes(searching) ||
            order.order_status.toLowerCase().includes(searching) ||
            format(new Date(order.date), "MMM dd, yyyy")
              .toLowerCase()
              .includes(searching)
        );
      }

      if (status !== "all") {
        result = result.filter((order: Order) => order.order_status === status);
      }

      setFilteredOrders(result);
    },
    []
  );

  // Handlers
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    applyFilters(allOrders, searchTerm, value);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(allOrders, value, statusFilter);
  };

  const handleUpdateOrder = (order: Order) => {
    setCurrentOrder(order);
    setIsUpdateDialogOpen(true);
  };

  const refreshOrders = async () => {
    setRefreshing(true);
    try {
      await fetchOrders();
      toast.success("Orders refreshed");
    } catch (error) {
      toast.error("Failed to refresh orders");
    } finally {
      setRefreshing(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const renderTableHeader = () => (
    <TableHeader>
      <TableRow>
        <TableHead>Order Date</TableHead>
        <TableHead>Customer</TableHead>
        <TableHead>Service</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Payment</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );

  const renderTableRow = (order: Order) => (
    <TableRow key={order.id}>
      <TableCell>
        <div className="font-medium">
          {format(new Date(order.date), "MMM dd, yyyy")}
        </div>
        <div className="text-xs text-muted-foreground">{order.time}</div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{order.user_name || "N/A"}</div>
        <div className="text-xs text-muted-foreground">{order.user_email}</div>
      </TableCell>
      <TableCell>
        <div className="max-w-[200px] truncate">
          {order.product_title}

          {order.address && (
            <div className="text-xs text-muted-foreground truncate">
              {order.address.length > 20
                ? `${order.address.slice(0, 20)}...`
                : order.address}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        {formatCurrency(Number(order.paid_amount) / 100, order.currency)}
      </TableCell>
      <TableCell>
        <Badge className={getStatusBadgeColor(order.order_status)}>
          {order.order_status.charAt(0).toUpperCase() +
            order.order_status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          className={getPaymentStatusBadgeColor(
            order.payment_status || "pending"
          )}
        >
          {(order.payment_status || "pending").charAt(0).toUpperCase() +
            (order.payment_status || "pending").slice(1)}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleUpdateOrder(order)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header section with search and refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-2 z-10 backdrop-blur-xl bg-background/50 rounded-lg border p-4">
        <h1 className="text-xl sm:text-2xl font-bold">Order Management</h1>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:min-w-[300px]">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              className="pl-8"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={refreshOrders}
            disabled={refreshing || loading}
            title="Refresh orders"
          >
            <RefreshCcw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Order List</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-2 justify-between">
            <span>Manage customer orders and their statuses</span>

            {/* Filter dropdown - now more mobile-friendly */}
            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger id="status-filter" className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Error state */}
          {error && (
            <div className="text-red-500 text-center py-4 bg-muted/50 rounded-lg">
              <p>Error fetching orders. Please try again.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setError(false);
                  fetchOrders();
                }}
              >
                Retry
              </Button>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Empty state - No orders found */}
          {!loading && !error && filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <h3 className="text-lg font-medium">No orders found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "When customers place orders, they will appear here"}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop view - Table (hidden on mobile) */}
              <div className="hidden lg:block rounded-md border overflow-x-auto">
                <Table>
                  {renderTableHeader()}
                  <TableBody>
                    {filteredOrders.map((order) => renderTableRow(order))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile view - Cards (visible only on small screens) */}
              <div className="lg:hidden space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 bg-card shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {format(new Date(order.date), "MMM dd, yyyy")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {order.time}
                          </span>
                        </div>
                      </div>

                      <Badge
                        className={getStatusBadgeColor(order.order_status)}
                      >
                        {order.order_status.charAt(0).toUpperCase() +
                          order.order_status.slice(1)}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="overflow-hidden">
                          <div className="font-medium truncate">
                            {order.user_name || "N/A"}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {order.user_email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2"></div>
                      <Camera className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="overflow-hidden">
                        <div className="truncate">{order.product_title}</div>
                        {order.address && (
                          <div className="text-xs text-muted-foreground truncate">
                            {order.address}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium">
                          {formatCurrency(
                            Number(order.paid_amount) / 100,
                            order.currency
                          )}
                        </span>
                      </div>

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

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateOrder(order)}
                      className="w-full mt-2"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Manage Order
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>

        {!loading && !error && filteredOrders.length > 0 && (
          <CardFooter className="text-sm text-muted-foreground border-t pt-4">
            Showing {filteredOrders.length} of {allOrders.length} orders
            {statusFilter !== "all" && (
              <> filtered by "{statusFilter}" status</>
            )}
            {searchTerm && <> matching "{searchTerm}"</>}
          </CardFooter>
        )}
      </Card>

      {/* Order Modal Component */}
      <OrderModal
        isUpdateDialogOpen={isUpdateDialogOpen}
        setIsUpdateDialogOpen={setIsUpdateDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        currentOrder={currentOrder}
        fetchOrders={fetchOrders}
      />
    </div>
  );
};

export default OrdersPage;
