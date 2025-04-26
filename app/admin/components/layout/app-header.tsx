import UserDropdown from "@/components/user-dropdown";

const AppHeader = () => {
  return (
    <div className="border-b bg-primary/50 h-14 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold truncate">Admin Dashboard</h1>
      </div>
      <UserDropdown />
    </div>
  );
};

export default AppHeader;
