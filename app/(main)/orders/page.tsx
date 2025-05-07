"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ExternalLink, Loader2, CalendarIcon, CreditCard } from "lucide-react";
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
import { getOrders, getUserOrders } from "@/lib/actions/orders-action";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/types/intrerface";
import OrderDetailsModal from "@/components/order-details-modal";
import Link from "next/link";
import { getAuthToken, verifyUserToken } from "@/lib/actions/user-action";
import { useUserStore } from "@/store/use-user";
import { useRouter } from "next/navigation";

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

const getStatusDescription = (status: string) => {
  switch (status) {
    case "pending":
      return "Your order is waiting to be processed";
    case "processing":
      return "Your order is currently being prepared";
    case "completed":
      return "Your order has been completed successfully";
    case "cancelled":
      return "This order has been cancelled";
    default:
      return "Status information unavailable";
  }
};

const OrdersPage = () => {
  const router = useRouter();

  const { token, setToken, logout, user } = useUserStore();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const checkAuthStatus = async () => {
    setIsCheckingAuth(true);

    try {
      const cookieToken = await getAuthToken();

      if (cookieToken && !token) {
        setToken(cookieToken);
      }

      const tokenToVerify = token || cookieToken;

      if (tokenToVerify) {
        const res = await verifyUserToken(tokenToVerify);

        if (res.authorized) {
          if (!token) {
            setToken(tokenToVerify);
          }
        } else {
          // Token is invalid
          toast.error("Session expired. Please log in again.");
          await logout();
          router.push("/login");
        }
      } else {
        // No token found anywhere
        toast.error("Authentication required. Please log in.");
        router.push("/login");
      }
    } catch (error) {
      toast.error("Authentication error. Please log in again.");
      await logout();
      router.push("/login");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Fetch all user orders from API
  const fetchOrders = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await getUserOrders(user?.id);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      setOrders(response);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load your orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Handler for viewing order details
  const handleViewDetails = (order: Order) => {
    setCurrentOrder(order);
    setIsModalOpen(true);
  };

  // Effects
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-slate-500 dark:text-slate-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
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
          <h1 className="text-3xl font-bold tracking-tight">
            My Photography Orders
          </h1>
          <p className="text-muted-foreground">
            Track the status of your photography bookings and view order details
            below.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Your Photography Bookings</CardTitle>
            <CardDescription>
              Here you can view all your photography bookings and their current
              status. Click on &quot;View Details&quot; to see complete
              information about your session, including location and special
              requests.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="mt-4 text-lg font-medium">
                  You don&apos;t have any orders yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Browse our photography services and book your first session
                </p>
                <Link
                  href="/investment"
                  className="inline-flex items-center justify-center"
                >
                  <Button className="mt-4">Browse Services</Button>
                </Link>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          Booking Date
                        </div>
                      </TableHead>
                      <TableHead>Photography Service</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Payment Amount
                        </div>
                      </TableHead>
                      <TableHead>Order Status</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div className="font-medium">
                            {format(new Date(order.date), "MMM dd, yyyy")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.time}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] font-medium">
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
                          <div className="font-medium">
                            {formatCurrency(
                              Number(order.paid_amount) / 100,
                              order.currency
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge
                              className={getStatusBadgeColor(
                                order.order_status
                              )}
                            >
                              {order.order_status.charAt(0).toUpperCase() +
                                order.order_status.slice(1)}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {getStatusDescription(order.order_status)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(order)}
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
            )}
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground border-t pt-4">
            Need help with your booking? Contact our support team at
            <Link
              className="hover:underline ml-1 hover:text-blue-500"
              href="mailto:m.rose.a.photography@gmail.com"
            >
              m.rose.a.photography@gmail.com
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Order Modal Component */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={currentOrder}
      />
    </div>
  );
};

export default OrdersPage;
