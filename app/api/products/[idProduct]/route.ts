import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { idProduct: string } }
) {
  try {
    const filePath = path.join(process.cwd(), "database", "products.json");

    const products = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const product = products.find(
      (product: any) => product.id == +params.idProduct
    );

    if (product) {
      return NextResponse.json(product);
    } else {
      return NextResponse.json({ message: "Không tìm thấy sản phẩm" });
    }
  } catch (er) {
    return NextResponse.json({ message: "Không thể tải sản phẩm" });
  }
}


export async function PUT(
    request: NextRequest,
    { params }: { params: { idProduct: string } }
  ) {
    try {
      const updatedData = await request.json();

      const filePath = path.join(process.cwd(), "database", "products.json");
  
      const products = JSON.parse(fs.readFileSync(filePath, "utf8"));
  
      const productIndex = products.findIndex(
        (product: any) => product.id == +params.idProduct
      );
  
      if (productIndex !== -1) {
  
        products[productIndex] = updatedData;

  
        fs.writeFileSync(filePath, JSON.stringify(products), "utf8");
  
        return NextResponse.json({ message: "Sản phẩm đã được cập nhật thành công", data: products });
      } else {
        return NextResponse.json({ message: "Không tìm thấy sản phẩm" });
      }
    } catch (er) {
      return NextResponse.json({ message: "Không cập nhật được sản phẩm" });
    }
}


export async function DELETE(
    request: NextRequest,
    { params }: { params: { idProduct: string } }
  ) {
    try {
      const filePath = path.join(process.cwd(), "database", "products.json");
  
      const products = JSON.parse(fs.readFileSync(filePath, "utf8"));

      const findIndexProducts = products.findIndex(
        (product: any) => product.id == +params.idProduct
      );
  
      if (findIndexProducts !==-1) {
        const deleteProducts = products.filter(
            (product: any) => product.id !== +params.idProduct
        );

        fs.writeFileSync(filePath, JSON.stringify(deleteProducts), "utf8");
  
        return NextResponse.json({ message: "Sản phẩm đã được xóa thành công", data: deleteProducts });
      } else {
        return NextResponse.json({ message: "Không tìm thấy sản phẩm" });
      }
    } catch (er) {
      return NextResponse.json({ message: "Không xóa được sản phẩm" });
    }
  }

