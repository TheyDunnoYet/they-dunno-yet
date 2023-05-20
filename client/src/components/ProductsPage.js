import React from "react";
import Product from "./Product"; // Make sure to create this component.

const ProductsPage = ({ products }) => {
  return (
    <div className="products-page">
      {products.map((product) => (
        <Product key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductsPage;
