"use client";

import { useState } from "react";
import { changePassword } from "./actions";
import { toast } from "sonner";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await changePassword(formData);
      
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success("Password updated successfully!");
        (e.target as HTMLFormElement).reset();
        
        // Log them out so they have to sign in with new password
        router.push("/admin/login");
        toast.message("Please log in with your new password");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your admin account credentials.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-6">Change Password</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Current Password</label>
            <div className="relative">
              <input
                name="currentPassword"
                type={showCurrent ? "text" : "password"}
                required
                disabled={isLoading}
                className="w-full px-4 py-2 pr-10 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                tabIndex={-1}
              >
                {showCurrent ? <EyeSlash className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">New Password</label>
            <div className="relative">
              <input
                name="newPassword"
                type={showNew ? "text" : "password"}
                required
                minLength={8}
                disabled={isLoading}
                className="w-full px-4 py-2 pr-10 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                tabIndex={-1}
              >
                {showNew ? <EyeSlash className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Confirm New Password</label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                required
                minLength={8}
                disabled={isLoading}
                className="w-full px-4 py-2 pr-10 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                tabIndex={-1}
              >
                {showConfirm ? <EyeSlash className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-foreground text-background font-medium rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
