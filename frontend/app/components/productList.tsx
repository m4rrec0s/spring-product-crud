import React from "react";
import { Product } from "../types/product";
import ProductItem from "./productItem";

interface ProductListProps {
  products: Product[];
  onEditProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onEditProduct,
  onDeleteProduct,
}) => {
  return (
    <ul className="flex flex-col gap-3">
      {products.map((product, index) => (
        <li key={index}>
          <ProductItem
            onDeleteProduct={onDeleteProduct}
            onEditProduct={onEditProduct}
            product={product}
          />
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
