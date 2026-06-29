"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AddressForm } from "@/components/account/address-form";

export default function EditAddressPage() {
  const router = useRouter();
  const params = useParams();
  const [initial, setInitial] = useState(null);
  const id = params.id as string;

  useEffect(() => {
    fetch(`/api/addresses/${id}`).then(r => r.json()).then(setInitial);
  }, [id]);

  if (!initial) return <div className="p-10 text-center text-muted-foreground">載入中...</div>;

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="font-heading text-2xl font-bold mb-6">編輯地址</h1>
      <AddressForm
        initial={initial}
        onSave={async (data) => {
          const res = await fetch(`/api/addresses/${id}`, {
            method: "PATCH",
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
