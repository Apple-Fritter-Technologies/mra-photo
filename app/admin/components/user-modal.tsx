"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Loader2 } from "lucide-react";
import { updateUser } from "@/lib/actions/user-action";
import { User } from "@/types/intrerface";

interface UserModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userData: User | null;
  refreshUsers: () => void;
  isEditing: boolean;
}

// Simplified validation schema for user role only
const userRoleSchema = z.object({
  id: z.string(),
  role: z.enum(["admin", "user"]),
  // Keep these fields to maintain the existing user data
  email: z.string().email(),
  name: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

// Define form values type from schema
type UserRoleFormValues = z.infer<typeof userRoleSchema>;

const UserModal = ({
  open,
  setOpen,
  userData,
  refreshUsers,
}: UserModalProps) => {
  const [loading, setLoading] = useState(false);

  // Initialize the form with role data
  const form = useForm<UserRoleFormValues>({
    resolver: zodResolver(userRoleSchema),
    defaultValues: {
      id: userData?.id || "",
      email: userData?.email || "",
      name: userData?.name || "",
      phone: userData?.phone || "",
      role: (userData?.role as "admin" | "user") || "user",
    },
  });

  // Update form values when userData changes
  useEffect(() => {
    if (userData) {
      form.reset({
        id: userData.id || "",
        email: userData.email || "",
        name: userData.name || "",
        phone: userData.phone || "",
        role: (userData.role as "admin" | "user") || "user",
      });
    }
  }, [userData, form]);

  const onSubmit = async (data: UserRoleFormValues) => {
    setLoading(true);
    try {
      // Only send necessary data for the update
      const response = await updateUser(data.id, data);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("User role updated successfully");
        setOpen(false);
        refreshUsers();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update user role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px]">
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

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Role
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
