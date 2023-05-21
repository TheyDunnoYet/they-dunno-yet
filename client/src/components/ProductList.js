import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/actions/productActions";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return loading ? (
    <p>Loading...</p>
  ) : (
    <div>
      {products.map((product) => (
        <div key={product._id}>
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          {/* You can add more fields here as needed */}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
