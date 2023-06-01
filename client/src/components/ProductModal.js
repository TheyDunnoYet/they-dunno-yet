import React, { useEffect } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useHistory,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../redux/actions/productActions";

const ProductModal = () => {
  let { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state && location.state.modal;
  const dispatch = useDispatch();

  const products = useSelector((state) => state.product.products);
  const product =
    location.state?.modal || products?.find((p) => p._id === productId);

  useEffect(() => {
    if (!product) {
      dispatch(getProducts());
    }
  }, [dispatch, productId, product]);

  const closeModal = () => {
    navigate(-1); // Go back to previous page
  };

  if (!background) return null;

  console.log("Product: ", product);
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md max-w-screen-lg max-h-screen-80 overflow-auto">
        <h1 className="text-2xl font-bold">{product?.title}</h1>
        <p className="text-sm">{product?.description}</p>
        <button
          onClick={closeModal}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProductModal;
