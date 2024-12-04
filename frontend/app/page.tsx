"use client";

import { useEffect, useState } from "react";
import FormProduct from "./components/formProduct";
import ProductList from "./components/productList";
import { Product } from "./types/product";
import { Input } from "./components/ui/input";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err: unknown) {
        setError((err as Error).message || "Erro ao carregar produtos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = (newProduct: { name: string; price: number }) => {
    const productWithId: Product = { ...newProduct, id: Date.now() };
    setProducts((prevProducts) => [...prevProducts, productWithId]);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center px-5">
      <section className="space-y-3 w-full max-w-[600px]">
        <div className="border p-6 rounded-lg shadow-sm">
          <h1 className="text-lg text-center mb-3">Cadastro de produtos</h1>
          <FormProduct onAddProduct={handleAddProduct} />
        </div>
        <div className="border p-6 rounded-lg shadow-sm h-[400px] overflow-y-scroll">
          <h2 className="text-lg text-center mb-3">Lista de produtos</h2>
          <Input
            placeholder="Buscar por produtos"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading ? (
            <div
              role="status"
              className="flex h-full w-full items-center justify-center flex-1"
            >
              <svg
                aria-hidden="true"
                className="h-8 w-8 animate-spin fill-gray-50 text-gray-200 dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-500 flex justify-center items-center h-full">
              Não existe produtos
            </div>
          ) : (
            <ProductList
              onDeleteProduct={handleDeleteProduct}
              onEditProduct={handleEditProduct}
              products={products}
              searchTerm={searchTerm}
            />
          )}
        </div>
      </section>
    </div>
  );
}
