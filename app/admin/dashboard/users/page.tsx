"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, UserCog, Mail, Phone, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import { User } from "@/types/intrerface";
import { getAllUsers } from "@/lib/actions/user-action";
import UserModal from "../../components/user-modal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        // off by one for admin
        const filteredUsers = data.filter(
          (user: User) => user.email !== "codebynikhil@gmail.com"
        );

        setUsers(filteredUsers);
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
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 space-y-4">
      <div className="flex justify-between flex-wrap gap-2 sm:gap-4 items-center sticky top-2 z-10 backdrop-blur-xl bg-background/50 rounded-lg border border-white/10 p-3 sm:p-4">
        <h1 className="text-xl sm:text-2xl font-bold">User Management</h1>
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
        <div>
          {/* Desktop view - Shadcn Table */}
          <div className="hidden lg:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name || "—"}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || "—"}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          user.role === "admin"
                            ? "bg-secondary text-white"
                            : "bg-primary text-black"
                        )}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.created_at
                        ? format(new Date(user.created_at), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUserRole(user)}
                        className="flex items-center gap-1 ml-auto"
                      >
                        <UserCog size={14} />
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile view - cards */}
          <div className="lg:hidden space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-4 border rounded-lg bg-card hover:bg-muted/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-base">
                    {user.name || "Unnamed User"}
                  </h3>
                  <Badge
                    className={cn(
                      user.role === "admin"
                        ? "bg-secondary text-white"
                        : "bg-primary text-black"
                    )}
                  >
                    {user.role}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Mail size={14} className="flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>

                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="flex-shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                  )}

                  {user.created_at && (
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="flex-shrink-0" />
                      <span>
                        {format(new Date(user.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditUserRole(user)}
                  className="flex items-center gap-1 w-full justify-center"
                >
                  <UserCog size={14} />
                  Manage User
                </Button>
              </div>
            ))}
          </div>
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
