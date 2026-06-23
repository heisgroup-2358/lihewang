"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Tag, MapPin, FolderTree } from "lucide-react";

type Tab = "categories" | "brands" | "origins";

type Category = { id: string; name: string; slug: string };
type Brand = { id: string; name: string; slug: string; code: string; };
type Origin = { id: string; name: string; slug: string };

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: "categories", label: "分類", icon: FolderTree },
  { key: "brands", label: "品牌", icon: Tag },
  { key: "origins", label: "產地", icon: MapPin },
];

function ItemRow({ item, apiPath, fields, onUpdate, onDelete }: {
  item: any; apiPath: string; fields: { key: string; label: string }[];
  onUpdate: (id: string, data: any) => Promise<boolean>; onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});

  const save = async () => {
    if (await onUpdate(item.id, form)) setEditing(false);
  };

  return (
    <tr key={item.id}>
      {editing ? (
        <>
          {fields.map((f) => (
            <td key={f.key} className="px-5 py-3">
              <input value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="rounded-full border border-border h-9 px-4 text-sm w-full"
                onKeyDown={(e) => e.key === "Enter" && save()} />
            </td>
          ))}
          <td className="px-5 py-3 text-right whitespace-nowrap">
            <button onClick={save} className="text-xs text-primary hover:underline mr-3">儲存</button>
            <button onClick={() => setEditing(false)} className="text-xs text-muted-foreground hover:underline">取消</button>
          </td>
        </>
      ) : (
        <>
          {fields.map((f) => (
            <td key={f.key} className="px-5 py-3 font-medium">{item[f.key]}</td>
          ))}
          <td className="px-5 py-3 text-right whitespace-nowrap">
            <button onClick={() => { setForm(item); setEditing(true); }} className="text-muted-foreground hover:text-foreground mr-3">
              <Pencil className="h-4 w-4 inline" />
            </button>
            <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700">
              <Trash2 className="h-4 w-4 inline" />
            </button>
          </td>
        </>
      )}
    </tr>
  );
}

function DataSection({ apiPath, title, fields, newForm }: {
  apiPath: string; title: string; fields: { key: string; label: string; placeholder: string }[];
  newForm: () => any;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState<any>({});

  const load = () => fetch(apiPath).then((r) => r.json()).then((d) => { setItems(d); setLoading(false); });
  useEffect(() => { load(); }, [apiPath]);

  const add = async () => {
    const data = newForm();
    for (const f of fields) data[f.key] = newItem[f.key] || "";
    const res = await fetch(apiPath, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) { setNewItem({}); load(); }
  };

  const update = async (id: string, data: any): Promise<boolean> => {
    const res = await fetch(`${apiPath}/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) { load(); return true; }
    return false;
  };

  const remove = async (id: string) => {
    if (!confirm("確定刪除？")) return;
    const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
    if (res.ok) load();
  };

  return (
    <div>
      <div className="flex gap-3 mb-6">
        {fields.map((f) => (
          <input key={f.key} value={newItem[f.key] || ""} onChange={(e) => setNewItem({ ...newItem, [f.key]: e.target.value })}
            placeholder={f.placeholder} className="flex-1 rounded-full border border-border h-11 px-5 text-sm" />
        ))}
        <button onClick={add} className="rounded-full bg-primary px-5 text-sm text-primary-foreground font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2 shrink-0">
          <Plus className="h-4 w-4" /> 新增
        </button>
      </div>

      {loading ? <p className="text-sm text-muted-foreground">載入中...</p> : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">暫無資料</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-secondary/20">
                {fields.map((f) => (<th key={f.key} className="px-5 py-3.5 text-left font-medium text-muted-foreground">{f.label}</th>))}
                <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {items.map((item) => (
                <ItemRow key={item.id} item={item} apiPath={apiPath} fields={fields} onUpdate={update} onDelete={remove} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [tab, setTab] = useState<Tab>("categories");

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">分類管理</h1>

      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            }`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "categories" && (
        <DataSection apiPath="/api/categories" title="分類" fields={[{ key: "name", label: "分類名稱", placeholder: "分類名稱 e.g. 禮盒" }]}
          newForm={() => ({ name: "" })} />
      )}
      {tab === "brands" && (
        <DataSection apiPath="/api/brands" title="品牌"
          fields={[
            { key: "name", label: "品牌名稱", placeholder: "品牌名稱 e.g. 石屋製菓" },
            { key: "code", label: "品牌代號", placeholder: "代號 e.g. ISH (用於貨號 ISH-0001)" },
          ]}
          newForm={() => ({ name: "", code: "" })} />
      )}
      {tab === "origins" && (
        <DataSection apiPath="/api/origins" title="產地" fields={[{ key: "name", label: "產地名稱", placeholder: "產地 e.g. 北海道" }]}
          newForm={() => ({ name: "" })} />
      )}

      {tab === "brands" && (
        <div className="mt-6 rounded-xl border border-border/40 bg-secondary/20 p-4">
          <p className="text-xs text-muted-foreground">
            💡 貨號格式：<strong>品牌代號-0001</strong>（例如 ISH-0001 = 石屋製菓嘅第一件產品）
          </p>
        </div>
      )}
    </div>
  );
}
