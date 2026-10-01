"use client";

import toast, { Toaster } from "react-hot-toast";

export function AppToaster() {
  return <Toaster position="top-right" containerStyle={{ top: 84, right: 16 }} />;
}

export function showErrorToast(message: string) {
  toast.custom(() => (
    <div role="status" className="pointer-events-auto max-w-sm rounded-xl border border-yellow-400 bg-[#0c0c0c] px-4 py-3 text-sm font-semibold text-white shadow-xl">
      {message}
    </div>
  ), { id: "cordova-auth", duration: 6000 });
}
