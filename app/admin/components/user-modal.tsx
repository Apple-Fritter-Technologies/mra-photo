"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { deleteUser, updateUser } from "@/lib/actions/user-action";
import { User } from "@/types/intrerface";
import { useUserStore } from "@/store/use-user";

interface UserModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userData: User | null;
  refreshUsers: () => void;
  isEditing: boolean;
}

const userRoleSchema = z.object({
  id: z.string(),
  role: z.enum(["admin", "user"]),
});

// Define form values type from schema
type UserRoleFormValues = z.infer<typeof userRoleSchema>;

const UserModal = ({
  open,
  setOpen,
  userData,
  refreshUsers,
}: UserModalProps) => {
  const { user } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRoleConfirm, setShowRoleConfirm] = useState(false);
  const [showAdminDowngradeWarning, setShowAdminDowngradeWarning] =
    useState(false);

  // Check if this is the current user's profile
  const isCurrentUser = userData?.id === user?.id;

  // Add a state to track if role has changed for more reactive button state
  const [roleChanged, setRoleChanged] = useState(false);

  // Initialize the form with role data only
  const form = useForm<UserRoleFormValues>({
    resolver: zodResolver(userRoleSchema),
    defaultValues: {
      id: userData?.id || "",
      role: (userData?.role as "admin" | "user") || "user",
    },
  });

  // Watch for role changes
  const currentRole = useWatch({
    control: form.control,
    name: "role",
  });

  // Update roleChanged state when role changes
  useEffect(() => {
    if (userData && currentRole) {
      setRoleChanged(userData.role !== currentRole);
    }
  }, [userData, currentRole]);

  // Update form values when userData changes
  useEffect(() => {
    if (userData) {
      form.reset({
        id: userData.id || "",
        role: (userData.role as "admin" | "user") || "user",
      });
      setRoleChanged(false); // Reset the role changed state
    }
  }, [userData, form]);

  const onSubmit = async (data: UserRoleFormValues) => {
    // Check if admin is trying to downgrade themselves
    if (isCurrentUser && userData?.role === "admin" && data.role === "user") {
      setShowAdminDowngradeWarning(true);
      return;
    }

    // Show confirmation dialog before updating role
    setShowRoleConfirm(true);
  };

  const confirmRoleUpdate = async () => {
    setLoading(true);
    setShowRoleConfirm(false);

    try {
      const data = form.getValues();
      const response = await updateUser(data.id, { role: data.role });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("User role updated successfully");
        setOpen(false);
        refreshUsers();
      }
    } catch (error: unknown) {
      toast.error("Failed to update user role");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    // Check if trying to delete themselves
    if (isCurrentUser) {
      toast.error("You cannot delete your own account", {
        description:
          "For security reasons, you cannot delete your own account.",
      });
      return;
    }

    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!userData?.id) {
      toast.error("User ID is required");
      return;
    }

    setLoading(true);
    setShowDeleteConfirm(false);

    try {
      const response = await deleteUser(userData?.id || "");

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("User deleted successfully");
        setOpen(false);
        refreshUsers();
      }
    } catch (error: unknown) {
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const proceedWithAdminDowngrade = () => {
    setShowAdminDowngradeWarning(false);
    setShowRoleConfirm(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90%] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 py-2"
            >
              <div className="space-y-2">
                <p className="text-sm font-medium">User: {userData?.email}</p>
                <p className="text-sm text-muted-foreground">
                  {userData?.name ? `Name: ${userData.name}` : ""}
                </p>
                {isCurrentUser && (
                  <div className="flex items-center gap-2 text-amber-500 bg-amber-50 p-2 rounded-md mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <p className="text-xs">This is your account</p>
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Admin users have full access to the dashboard.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteClick}
                  disabled={loading || isCurrentUser}
                  title={
                    isCurrentUser
                      ? "You cannot delete your own account"
                      : "Delete user"
                  }
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading || !roleChanged}>
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update Role
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Role Update Confirmation Dialog */}
      <AlertDialog open={showRoleConfirm} onOpenChange={setShowRoleConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this user&apos;s role to{" "}
              {form.getValues().role}? This will change their permissions in the
              system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleUpdate}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Admin Self-Downgrade Warning Dialog */}
      <AlertDialog
        open={showAdminDowngradeWarning}
        onOpenChange={setShowAdminDowngradeWarning}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-amber-600">
              Warning: Downgrading Your Admin Access
            </AlertDialogTitle>
            <AlertDialogDescription>
              <span className="flex flex-col gap-2">
                <span>
                  You are about to change your own role from Admin to User.
                </span>
                <span className="font-medium">
                  This will remove your administrative privileges, and you may
                  lose access to this admin dashboard.
                </span>
                <span>Are you sure you want to continue?</span>
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-amber-600 hover:bg-amber-700 hover:text-white text-white"
              onClick={proceedWithAdminDowngrade}
            >
              I Understand, Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserModal;
