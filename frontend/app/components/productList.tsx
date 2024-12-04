import React from "react";
import { Product } from "../types/product";
import ProductItem from "./productItem";

interface ProductListProps {
  products: Product[];
  onEditProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: number) => void;
  searchTerm: string;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onEditProduct,
  onDeleteProduct,
  searchTerm,
}) => {
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <ul className="flex flex-col gap-2 mt-3">
        {filteredProducts.map((product, index) => (
          <li
            key={index}
            className="hover:opacity-100 opacity-80 transition-opacity"
          >
            <ProductItem
              onDeleteProduct={onDeleteProduct}
              onEditProduct={onEditProduct}
              product={product}
            />
          </li>
        ))}
        {filteredProducts.length === 0 && (
          <li className="flex justify-center items-center h-full">
            <p className="text-center text-gray-500 ">
              Nenhum produto encontrado na busca.
            </p>
          </li>
        )}
      </ul>
    </>
  );
};

export default ProductList;
