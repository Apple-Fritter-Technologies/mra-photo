import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarIcon,
  CameraIcon,
  ImageIcon,
  UsersIcon,
  InboxIcon,
  TrendingUpIcon,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Total Photos</CardTitle>
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">256</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Active Users</CardTitle>
            <UsersIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              Upcoming Bookings
            </CardTitle>
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Next one: Oct 14</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  icon: <CameraIcon className="h-4 w-4" />,
                  title: "New Photoshoot Added",
                  desc: "Spring Collection 2025",
                  time: "2 hours ago",
                },
                {
                  icon: <UsersIcon className="h-4 w-4" />,
                  title: "New Client Registration",
                  desc: "Emily Johnson",
                  time: "Yesterday",
                },
                {
                  icon: <InboxIcon className="h-4 w-4" />,
                  title: "Inquiry Received",
                  desc: "Wedding Photography Package",
                  time: "2 days ago",
                },
                {
                  icon: <ImageIcon className="h-4 w-4" />,
                  title: "Gallery Published",
                  desc: "Parker Family Session",
                  time: "3 days ago",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground">
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <button className="text-sm text-primary hover:underline">
              View all activity
            </button>
          </CardFooter>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                icon: <CameraIcon className="h-4 w-4" />,
                label: "Add New Photoshoot",
              },
              {
                icon: <ImageIcon className="h-4 w-4" />,
                label: "Upload Photos",
              },
              {
                icon: <CalendarIcon className="h-4 w-4" />,
                label: "Schedule Session",
              },
              {
                icon: <TrendingUpIcon className="h-4 w-4" />,
                label: "View Analytics",
              },
            ].map((action, i) => (
              <button
                key={i}
                className="flex items-center gap-3 w-full p-3 text-left rounded-md hover:bg-accent transition-colors"
              >
                <div className="bg-primary/10 p-2 rounded-full">
                  {action.icon}
                </div>
                <span>{action.label}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
