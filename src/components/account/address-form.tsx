"use client";

import { useState } from "react";
import { SfStationPicker } from "./sf-station-picker";

type AddressFormProps = {
  initial?: { label: string; name: string; phone: string; district: string; detail: string; sfCode?: string; sfName?: string; isDefault: boolean };
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
  onCancel: () => void;
};

const DISTRICTS = ["香港島", "九龍", "新界", "離島"];
const LABELS = ["屋企", "公司", "順豐站", "其他"];

export function AddressForm({ initial, onSave, onCancel }: AddressFormProps) {
  const [type, setType] = useState<"custom" | "sf">(initial?.sfCode ? "sf" : "custom");
  const [label, setLabel] = useState(initial?.label || "屋企");
  const [name, setName] = useState(initial?.name || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [district, setDistrict] = useState(initial?.district || "香港島");
  const [detail, setDetail] = useState(initial?.detail || "");
  const [sfCode, setSfCode] = useState(initial?.sfCode || "");
  const [sfName, setSfName] = useState(initial?.sfName || "");
  const [isDefault, setIsDefault] = useState(initial?.isDefault || false);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    const ok = await onSave({ label, name, phone, district, detail, sfCode: sfCode || null, sfName: sfName || null, isDefault });
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["custom", "sf"] as const).map((t) => (
          <button key={t} onClick={() => setType(t)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${type === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
            {t === "custom" ? "自訂地址" : "順豐站"}
          </button>
        ))}
      </div>

      {type === "sf" ? (
        <div>
          <p className="text-sm text-muted-foreground mb-2">搜尋順豐站點</p>
          <SfStationPicker onSelect={(s) => { setSfCode(s.code); setSfName(s.name); setDetail(s.address); setDistrict(s.district); setLabel("順豐站"); }} />
          {sfCode && (
            <div className="mt-3 rounded-lg bg-secondary/20 p-3 text-sm">
              <p className="font-medium">{sfName}</p>
              <p className="text-muted-foreground">{detail}</p>
              <p className="text-muted-foreground">點碼: {sfCode}</p>
            </div>
          )}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">收件人</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-full border border-border h-10 px-4 text-sm" />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">電話</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-full border border-border h-10 px-4 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">標籤</label>
          <select value={label} onChange={(e) => setLabel(e.target.value)} className="w-full rounded-full border border-border h-10 px-4 text-sm bg-background">
            {LABELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">地區</label>
          <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full rounded-full border border-border h-10 px-4 text-sm bg-background">
            {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">詳細地址</label>
        <input value={detail} onChange={(e) => setDetail(e.target.value)} className="w-full rounded-full border border-border h-10 px-4 text-sm" />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
        設為預設地址
      </label>

      <div className="flex gap-3">
        <button onClick={submit} disabled={saving}
          className="rounded-full bg-primary px-6 h-10 text-sm text-primary-foreground font-medium hover:bg-primary/90">
          {initial ? "儲存" : "新增"}
        </button>
        <button onClick={onCancel} className="rounded-full border border-border px-6 h-10 text-sm hover:bg-secondary/20">
          取消
        </button>
      </div>
    </div>
  );
}
