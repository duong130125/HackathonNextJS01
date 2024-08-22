"use client";
import axios from "axios";
import React, { useEffect, useState, FormEvent } from "react";
import Swal from "sweetalert2";

interface Product {
  id: number;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Page() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    price: 0,
    image: "",
    quantity: 1,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get("http://localhost:3000/api/products")
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "price" ? parseInt(value, 10) : value,
    }));
  };

  const validateProduct = () => {
    const isDuplicate = products.some(
      (product) =>
        product.productName.toLowerCase() ===
          newProduct.productName.toLowerCase() &&
        (!isEditMode || product.id !== editingProductId)
    );
    if (isDuplicate) {
      Swal.fire({
        icon: "error",
        title: "Tên sản phẩm bị trùng",
        text: "Tên sản phẩm này đã tồn tại. Vui lòng chọn tên khác.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateProduct()) return;

    const apiCall =
      isEditMode && editingProductId !== null
        ? axios.put(
            `http://localhost:3000/api/products/${editingProductId}`,
            newProduct
          )
        : axios.post("http://localhost:3000/api/products", newProduct);

    apiCall
      .then(() => {
        fetchProducts();
        resetForm();
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (product: Product) => {
    setNewProduct(product);
    setIsEditMode(true);
    setEditingProductId(product.id);
  };

  const handleDelete = (product: Product) => {
    Swal.fire({
      title: "Xác nhận xóa",
      text: `Bạn có chắc chắn muốn xóa sản phẩm "${product.productName}" không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/api/products/${product.id}`)
          .then(() => {
            fetchProducts();
            Swal.fire("Đã xóa!", "Sản phẩm đã được xóa.", "success");
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const resetForm = () => {
    setNewProduct({ productName: "", price: 0, image: "", quantity: 1 });
    setIsEditMode(false);
    setEditingProductId(null);
  };

  return (
    <>
      <div className="flex p-4">
        <table className="w-3/4 border-collapse mr-4">
          <thead>
            <tr>
              <th className="border px-4 py-2 bg-gray-100">STT</th>
              <th className="border px-4 py-2 bg-gray-100">Tên sản phẩm</th>
              <th className="border px-4 py-2 bg-gray-100">Hình ảnh</th>
              <th className="border px-4 py-2 bg-gray-100">Giá</th>
              <th className="border px-4 py-2 bg-gray-100">Số lượng</th>
              <th className="border px-4 py-2 bg-gray-100">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className="text-center">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{product.productName}</td>
                <td className="border px-4 py-2 flex justify-center">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-20 h-28"
                  />
                </td>
                <td className="border px-4 py-2">
                  {formatCurrency(product.price)}
                </td>
                <td className="border px-4 py-2">{product.quantity}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded mr-2"
                    onClick={() => handleEdit(product)}
                  >
                    Sửa
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(product)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="w-1/4">
          <h2 className="text-lg font-bold mb-2">
            {isEditMode ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm"}
          </h2>
          <form className="space-y-2" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên
              </label>
              <input
                type="text"
                name="productName"
                value={newProduct.productName}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hình ảnh
              </label>
              <input
                type="text"
                name="image"
                value={newProduct.image}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giá
              </label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                min={0}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Số lượng
              </label>
              <input
                type="number"
                name="quantity"
                value={newProduct.quantity}
                onChange={handleInputChange}
                min={1}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {isEditMode ? "Cập nhật" : "Thêm"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
