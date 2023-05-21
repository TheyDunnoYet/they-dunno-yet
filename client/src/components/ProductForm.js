import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../redux/actions/productActions";
import { clearErrors } from "../redux/actions/errorActions";
import { getTopics } from "../redux/actions/topicActions";
import {
  Button,
  TextField,
  Snackbar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

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
  const { topics, topicErrors } = useSelector((state) => state.topic);
  const { productErrors } = useSelector((state) => state.errors);

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState({
    images: [""],
    title: "",
    tagline: "",
    description: "",
    tags: [""],
    url: "",
    dropDate: "",
    topic: "", // initialize topic with an empty string
  });

  useEffect(() => {
    dispatch(getTopics())
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [dispatch]);

  const handleChange = (e) => {
    if (e.target.name === "images") {
      let imageArray = e.target.value
        ? e.target.value.split(",").map((item) => item.trim())
        : [""];
      setProduct({ ...product, [e.target.name]: imageArray });
    } else {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearErrors());
    let finalProduct = {
      ...product,
      images: product.images.map((item) => item.trim()),
    };
    dispatch(addProduct(finalProduct))
      .then(() => {
        setOpen(true);
        setProduct({
          images: [""],
          title: "",
          tagline: "",
          description: "",
          tags: [""],
          url: "",
          dropDate: "",
          topic: "",
        });
      })
      .catch((err) => console.log(err));
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.root}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <form onSubmit={handleSubmit}>
            <TextField
              name="images"
              value={product.images[0]}
              onChange={handleChange}
              label="Product Images"
              variant="outlined"
              fullWidth
            />
            <TextField
              name="title"
              value={product.title}
              onChange={handleChange}
              label="Product Title"
              variant="outlined"
              fullWidth
            />
            <TextField
              name="tagline"
              value={product.tagline}
              onChange={handleChange}
              label="Product Tagline"
              variant="outlined"
              fullWidth
            />
            <TextField
              name="description"
              value={product.description}
              onChange={handleChange}
              label="Product Description"
              variant="outlined"
              fullWidth
            />
            <TextField
              name="tags"
              value={product.tags[0]}
              onChange={handleChange}
              label="Product Tags"
              variant="outlined"
              fullWidth
            />
            <TextField
              name="url"
              value={product.url}
              onChange={handleChange}
              label="Product URL"
              variant="outlined"
              fullWidth
            />
            <TextField
              name="dropDate"
              value={product.dropDate}
              onChange={handleChange}
              label="Product Drop Date"
              variant="outlined"
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Topic</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={product.topic}
                onChange={handleChange}
                name="topic"
              >
                {topics
                  .filter((topic) => topic !== undefined) // filter out undefined topics
                  .map((topic) => (
                    <MenuItem value={topic._id} key={topic._id}>
                      {topic.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <Button type="submit" variant="contained" color="primary">
              Create Product
            </Button>
          </form>

          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              The product has been created successfully!
            </Alert>
          </Snackbar>

          {productErrors && <Alert severity="error">{productErrors.msg}</Alert>}
          {topicErrors && <Alert severity="error">{topicErrors.msg}</Alert>}
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductForm;
