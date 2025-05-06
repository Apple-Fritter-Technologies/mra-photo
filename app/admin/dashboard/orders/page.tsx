"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  RefreshCcw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import OrderModal from "../../components/order-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getOrders } from "@/lib/actions/orders-action";
import { Order } from "@/types/intrerface";

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
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const OrdersPage = () => {
  // State variables
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const ordersPerPage = 10;

  // Fetch orders from API
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

      // Filter orders based on search and status
      let filteredOrders = response;

      if (searchTerm) {
        filteredOrders = filteredOrders.filter(
          (order: Order) =>
            order.product_title
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            order.user_email
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (statusFilter !== "all") {
        filteredOrders = filteredOrders.filter(
          (order: Order) => order.order_status === statusFilter
        );
      }

      // Calculate pagination
      const totalItems = filteredOrders.length;
      setTotalPages(Math.ceil(totalItems / ordersPerPage));

      // Get current page items
      const start = (currentPage - 1) * ordersPerPage;
      const end = start + ordersPerPage;
      const paginatedOrders = filteredOrders.slice(start, end);

      setOrders(paginatedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(true);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchTerm]);

  // Handlers
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchOrders();
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

  // Component parts
  const renderSearchBar = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-2 z-10 backdrop-blur-xl bg-background/50 rounded-lg border p-4">
      <h1 className="text-2xl font-bold">Order Management</h1>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-none sm:min-w-[300px]">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(e);
              }
            }}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={refreshOrders}
          disabled={refreshing || loading}
        >
          <RefreshCcw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
    </div>
  );

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
        <div className="max-w-[200px] truncate">{order.product_title}</div>
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

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center space-x-2 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {renderSearchBar()}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Order List</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-2 justify-between">
            <span>Manage customer orders and their statuses</span>

            {/* filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger id="status-filter" className="mt-1">
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

          {loading && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && !error && orders.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <h3 className="text-lg font-medium">No orders found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "When customers place orders, they will appear here"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                {renderTableHeader()}
                <TableBody>
                  {orders.map((order) => renderTableRow(order))}
                </TableBody>
              </Table>
            </div>
          )}

          {renderPagination()}
        </CardContent>
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
