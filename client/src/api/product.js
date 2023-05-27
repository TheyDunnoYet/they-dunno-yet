import axios from "axios";
import AWS from "aws-sdk";

const BASE_URL = "http://localhost:5001/api/product";

const API = axios.create({ baseURL: BASE_URL });

// Interceptor
API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
  config.headers["x-auth-token"] = token ? `${token}` : "";
  config.headers["Content-type"] = "application/json";
  return config;
});

const spacesEndpoint = new AWS.Endpoint("nyc3.digitaloceanspaces.com");
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
});

export async function uploadFileToDigitalOcean(file) {
  const fileName = `${Date.now()}-${file.name}`; // make sure filename is unique
  const params = {
    Bucket: "they-dunno-yet",
    Key: fileName,
    Body: file,
    ACL: "public-read", // if you want the file to be publicly accessible
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location; // URL of the uploaded file
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw error;
  }
}

export const addProduct = async (product) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-auth-token":
        localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken"),
    },
  };

  for (let pair of product.entries()) {
    console.log(pair[0] + ", " + pair[1]);
  }

  try {
    const { data } = await API.post("/", product, config);
    // console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllProducts = async () => {
  try {
    const { data } = await API.get("/");
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchProduct = async (productId) => {
  try {
    const { data } = await API.get(`/${productId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllBlockchains = async () => {
  try {
    const { data } = await API.get("/blockchains");
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllMarketplaces = async () => {
  try {
    const { data } = await API.get("/marketplaces");
    return data;
  } catch (error) {
    throw error;
  }
};
