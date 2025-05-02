"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import { User } from "@/types/intrerface";
import { getAllUsers } from "@/lib/actions/user-action";
import UserModal from "../../components/user-modal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();

      if (data.error) {
        setError(data.error);
        toast.error(data.error);
      } else {
        setUsers(data);
        setError(null);
      }
    } catch (error: unknown) {
      setError("Failed to fetch users");
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUserRole = (user: User) => {
    setCurrentUser(user);
    setOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      <div className="flex justify-between flex-wrap gap-4 items-center sticky top-2 z-10 backdrop-blur-xl bg-background/50 rounded-lg border border-white/10 p-4">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      {error && (
        <div className="text-red-500 text-center py-4 bg-muted/50 rounded-lg">
          <p>{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setError(null);
              fetchUsers();
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

      {!loading && !error && users.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-medium">No users found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            There are currently no users in the system
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left bg-muted/50">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Created</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-muted hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4">{user.name || "—"}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.phone || "—"}</td>
                  <td className="p-4">
                    <Badge
                      className={cn(
                        user.role === "admin"
                          ? "bg-secondary text-white"
                          : "bg-primary text-black"
                      )}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {user.created_at
                      ? format(new Date(user.created_at), "MMM d, yyyy")
                      : "—"}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUserRole(user)}
                        className="flex items-center gap-1"
                      >
                        <UserCog size={14} />
                        Manage
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Role Edit Modal */}
      <UserModal
        open={open}
        setOpen={setOpen}
        userData={currentUser}
        refreshUsers={fetchUsers}
        isEditing={true}
      />
    </div>
  );
};

export default UsersPage;
