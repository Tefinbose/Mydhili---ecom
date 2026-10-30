
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to log out.");
        setLoading(false);
        return;
      }

      router.replace("/admin/login");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="text-right">
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className="inline-flex items-center gap-2 border border-[#E9DFD2] px-4 py-2.5 text-sm transition hover:border-[#380712] hover:bg-[#380712] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <LogOut className="h-4 w-4" />
        {loading ? "Signing out..." : "Logout"}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
