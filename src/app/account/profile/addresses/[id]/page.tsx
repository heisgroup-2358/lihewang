"use client";

import { useRouter } from "next/navigation";
import { AddressForm } from "@/components/account/address-form";

export default function EditAddressPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="font-heading text-2xl font-bold mb-6">編輯地址</h1>
      <AddressForm
        onSave={async (data) => {
          const res = await fetch("/api/addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (res.ok) { router.push("/account/profile"); return true; }
          return false;
        }}
        onCancel={() => router.push("/account/profile")}
      />
    </div>
  );
}
