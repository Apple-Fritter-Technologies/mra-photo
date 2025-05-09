"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarIcon,
  UsersIcon,
  PackageIcon,
  FolderIcon,
  ArrowUpRightIcon,
  RefreshCwIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats } from "@/lib/actions/dashboard-action";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "motion/react";
import { dashboardQuickAction } from "@/lib/data";

interface DashboardData {
  totalProducts: number;
  totalPortfolios: number;
  totalUsers: number;
  totalInquiries: number;
  totalCarousels: number;
  totalOrders: number;
}

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const stats = [
    {
      title: "Total Products",
      value: data?.totalProducts,
      description: "Total number of products listed",
      icon: <PackageIcon size={20} />,
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "Total Portfolios",
      value: data?.totalPortfolios,
      description: "Total number of portfolios created",
      icon: <FolderIcon size={20} />,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Total Users",
      value:
        data?.totalUsers && data?.totalUsers > 0 ? data?.totalUsers - 1 : 0, // off by one for admin
      description: "Total number of registered users",
      icon: <UsersIcon size={20} />,
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Total Inquiries",
      value: data?.totalInquiries,
      description: "Total number of inquiries made",
      icon: <CalendarIcon size={20} />,
      color: "bg-orange-500/10 text-orange-500",
    },
    {
      title: "Total Carousel Images",
      value: data?.totalCarousels,
      description: "Total number of images in the carousel",
      icon: <PackageIcon size={20} />,
      color: "bg-red-500/10 text-red-500",
    },
    {
      title: "Total Orders",
      value: data?.totalOrders,
      description: "Total number of orders placed",
      icon: <PackageIcon size={20} />,
      color: "bg-yellow-500/10 text-yellow-500",
    },
  ];

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await getDashboardStats();
      if (res.error) {
        setError(res.error);
        toast.error(res.error);
      } else {
        setData(res);
      }
    } catch (err) {
      setError(true);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => fetchDashboardData()}
        >
          <RefreshCwIcon size={14} />
          <span>Refresh</span>
        </Button>
      </div>

      {error && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-8 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 flex items-center justify-between"
        >
          <p>Error fetching dashboard data. Please try again.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setError(false);
              fetchDashboardData();
            }}
          >
            Retry
          </Button>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.4 }}
        className="lg:col-span-1"
      >
        <Card className="h-full shadow-md shadow-muted/10 border-none hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 w-full">
            {dashboardQuickAction.map((action, i) => (
              <Link key={i} href={action.href} className="flex-1">
                <div className="group flex items-center justify-between p-4 rounded-xl border border-muted bg-card hover:bg-accent/50 transition-colors gap-2">
                  <div className="flex items-center gap-4">
                    <div className={`${action.color} p-3 rounded-lg`}>
                      {<action.icon size={20} />}
                    </div>
                    <span className="font-medium">{action.label}</span>
                  </div>
                  <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-none shadow-md shadow-muted/10 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2 pt-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-20 mb-1" />
                ) : (
                  <div className="text-3xl font-bold">{stat.value}</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
