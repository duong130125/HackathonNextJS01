import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
      const filePath = path.join(process.cwd(), "database", "products.json");
     
      const data = fs.readFileSync(filePath, "utf8");
     
      const products = JSON.parse(data);
      return NextResponse.json({ data: products });
    } catch (er) {
      return NextResponse.json("Lấy dữ liệu thất bại");
    }
  }
  
export async function POST(request: NextRequest, response: NextResponse) {
    try {
        const newProduct = await request.json();

        const filePath = path.join(process.cwd(), "database", "products.json");

        const products = JSON.parse(fs.readFileSync(filePath, "utf8"));

        const maxId = products.reduce(
          (max: number, product: any) => Math.max(max, product.id),
          0
        );
    
        newProduct.id = maxId + 1;
        products.push(newProduct);

        fs.writeFileSync(filePath, JSON.stringify(products), "utf8");
        return NextResponse.json("Thêm mới dữ liệu thành công");
    } catch (er) {
        return NextResponse.json("Thêm mới dữ liệu thất bại");
    }
}
