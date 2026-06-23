import { NextResponse } from "next/server";

export async function GET() {
  const headers =
    "name,slug,brand,origin,categorySlug,description,retailPrice,wholesalePriceL1,wholesalePriceL2,costPrice,stock,badge,imageUrl\n";
  const example =
    "白之戀人 24件入,ishiya-white-chocolate,石屋製菓 Ishiya,北海道,hokkaido,來自北海道的經典手信,388,298,268,200,50,人氣熱賣,https://example.com/image.jpg\n";
  const bom = "\uFEFF";
  const csv = bom + headers + example;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=products-template.csv",
    },
  });
}
