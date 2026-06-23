import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;

    const supabase = getSupabase();
    const { data, error } = await supabase.storage
      .from("products")
      .upload(fileName, buffer, { contentType: file.type });

    if (error) {
      if (error.message?.includes("bucket")) {
        return NextResponse.json(
          { error: 'Storage bucket "products" does not exist. Please create it in Supabase Dashboard.' },
          { status: 400 }
        );
      }
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
