"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

type DataItem = { id: string; name: string; slug: string };

export function DataManager({ title, apiPath }: { title: string; apiPath: string }) {
  const [items, setItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DataItem | null>(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetch(apiPath).then((r) => r.json()).then((data) => { setItems(data); setLoading(false); });
  }, [apiPath]);

  const addItem = async () => {
    if (!newName.trim()) return;
    const res = await fetch(apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    if (res.ok) {
      const item = await res.json();
      setItems((prev) => [...prev, item]);
      setNewName("");
    }
  };

  const updateItem = async () => {
    if (!editing || !editing.name.trim()) return;
    const res = await fetch(`${apiPath}/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editing.name.trim() }),
    });
    if (res.ok) {
      setItems((prev) => prev.map((i) => (i.id === editing.id ? { ...i, name: editing.name } : i)));
      setEditing(null);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("確定刪除？")) return;
    const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">{title}</h1>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={`新增${title}`}
          className="flex-1 rounded-full border border-border h-11 px-5 text-sm"
          onKeyDown={(e) => e.key === "Enter" && addItem()}
        />
        <button onClick={addItem} className="rounded-full bg-primary px-5 text-sm text-primary-foreground font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> 新增
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">載入中...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">暫無資料</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-secondary/20">
                <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">名稱</th>
                <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Slug</th>
                <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {items.map((item) => (
                <tr key={item.id}>
                  {editing?.id === item.id ? (
                    <>
                      <td className="px-5 py-3">
                        <input
                          value={editing.name}
                          onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                          className="rounded-full border border-border h-9 px-4 text-sm w-full"
                          onKeyDown={(e) => e.key === "Enter" && updateItem()}
                        />
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{item.slug}</td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={updateItem} className="text-xs text-primary hover:underline mr-3">儲存</button>
                        <button onClick={() => setEditing(null)} className="text-xs text-muted-foreground hover:underline">取消</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-3 font-medium">{item.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{item.slug}</td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => setEditing(item)} className="text-muted-foreground hover:text-foreground mr-3">
                          <Pencil className="h-4 w-4 inline" />
                        </button>
                        <button onClick={() => deleteItem(item.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
