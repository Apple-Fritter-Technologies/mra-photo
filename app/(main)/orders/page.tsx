"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  ShoppingBag,
  ExternalLink,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/store/use-user";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  id: string;
  date: Date;
  time: string;
  product_name: string;
  amount: number;
  currency: string;
  status: string;
  reference: string;
}

const OrdersPage = () => {
  const router = useRouter();
  const { token, user } = useUserStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 10;

  // Fetch orders from API
  const fetchOrders = async () => {
    if (!user?.id) {
      toast.error("User ID not found");
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      // Replace with your actual API call
      // const response = await getUserOrders(user.id, currentPage, ordersPerPage, statusFilter, searchTerm);

      // Mock data for development
      const mockOrders = Array.from({ length: 25 }, (_, i) => ({
        id: `order-${i + 1}`,
        date: new Date(Date.now() - Math.random() * 10000000000),
        time: `${Math.floor(Math.random() * 12 + 1)}:${Math.floor(
          Math.random() * 60
        )
          .toString()
          .padStart(2, "0")} ${Math.random() > 0.5 ? "AM" : "PM"}`,
        product_name: `Photography Package ${
          ["Basic", "Standard", "Premium", "Wedding", "Portrait"][
            Math.floor(Math.random() * 5)
          ]
        }`,
        amount: Math.floor(Math.random() * 100000) / 100 + 99,
        currency: "USD",
        status: ["pending", "processing", "completed", "cancelled"][
          Math.floor(Math.random() * 4)
        ],
        reference: `REF-${Math.floor(Math.random() * 10000)}`,
      }));

      // Filter mock data based on search and status
      let filteredOrders = mockOrders;

      if (searchTerm) {
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.product_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            order.reference.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (statusFilter !== "all") {
        filteredOrders = filteredOrders.filter(
          (order) => order.status === statusFilter
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
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login to view your orders");
      router.push("/login");
      return;
    }

    fetchOrders();
  }, [token, currentPage, statusFilter, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchOrders();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-slate-500 dark:text-slate-400">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-8 px-4 md:px-6 lg:py-12 min-h-[80vh]">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground">
            View and manage all your photography bookings and orders
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Order History</CardTitle>
            <CardDescription>
              Track the status of recent and past photography bookings
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by product or reference number"
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    Search
                  </Button>
                </div>
              </form>

              <div className="w-full md:w-48">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="status-filter">Status</Label>
                </div>
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
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">No orders found</p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "When you book a photography session, it will appear here"}
                </p>
                <Button
                  className="mt-4"
                  onClick={() => router.push("/services")}
                >
                  Browse Photography Services
                </Button>
              </div>
            ) : (
              <>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            {format(new Date(order.date), "MMM dd, yyyy")}
                            <div className="text-xs text-muted-foreground">
                              {order.time}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {order.reference}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {order.product_name}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(order.amount, order.currency)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/orders/${order.id}`)}
                            >
                              View Details
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
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
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        )
                      )}
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
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrdersPage;
