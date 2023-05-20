import React from "react";

const Product = ({ product }) => {
  return (
    <div className="product">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      {/* Add other product details as required */}
    </div>
  );
};

export default Product;
