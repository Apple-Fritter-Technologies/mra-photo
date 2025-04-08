import AppSidebar from "../components/layout/app-sidebar";
import AppHeader from "../components/layout/app-header";
import Footer from "@/components/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />

      <div className="flex-1 overflow-hidden flex flex-col">
        <AppHeader />
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-6 min-h-screen">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
