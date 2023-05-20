import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../redux/actions/productActions";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

// Alert component from material UI
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const ProductForm = () => {
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.errors);

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addProduct(product))
      .then(() => {
        setOpen(true);
        setProduct({ name: "", price: "", description: "" });
      })
      .catch((err) => console.log(err));
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          value={product.name}
          onChange={handleChange}
          label="Product Name"
          variant="outlined"
        />
        <TextField
          name="price"
          value={product.price}
          onChange={handleChange}
          label="Product Price"
          variant="outlined"
        />
        <TextField
          name="description"
          value={product.description}
          onChange={handleChange}
          label="Product Description"
          variant="outlined"
        />

        <Button type="submit" variant="contained" color="primary">
          Create Product
        </Button>
      </form>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          The product has been created successfully!
        </Alert>
      </Snackbar>

      {errors.id === "CREATE_PRODUCT_FAIL" && (
        <Alert severity="error">{errors.msg}</Alert>
      )}
    </div>
  );
};

export default ProductForm;
