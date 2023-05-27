import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../redux/actions/productActions";
import { getBlockchains } from "../redux/actions/blockchainActions";
import { getMarketplaces } from "../redux/actions/marketplaceActions";
import { clearErrors } from "../redux/actions/errorActions";
import { getTopics } from "../redux/actions/topicActions";
import { getFeeds } from "../redux/actions/feedActions";
import {
  Button,
  TextField,
  Snackbar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

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
  const { feeds, feedErrors } = useSelector((state) => state.feed);
  const { topics, topicErrors } = useSelector((state) => state.topic);
  const { blockchains, blockchainErrors } = useSelector(
    (state) => state.blockchain
  );
  const { marketplaces, marketplaceErrors } = useSelector(
    (state) => state.marketplace
  );
  const { productErrors } = useSelector((state) => state.errors);

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState({
    image: "",
    title: "",
    tagline: "",
    description: "",
    tags: {},
    url: "",
    dropDate: "",
    topic: "",
    feed: "",
    blockchain: "",
    marketplace: "",
  });

  const [topicDisabled, setTopicDisabled] = useState(true);
  const [blockchainDisabled, setBlockchainDisabled] = useState(true);
  const [marketplaceDisabled, setMarketplaceDisabled] = useState(true);
  const [otherFieldsDisabled, setOtherFieldsDisabled] = useState(true);

  const [selectedFeed, setSelectedFeed] = useState(null);
  const [selectedBlockchain, setSelectedBlockchain] = useState(null);

  const [showMarketplace, setShowMarketplace] = useState(false);

  const [errors, setErrors] = useState({});

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    Promise.all([
      dispatch(getTopics()),
      dispatch(getFeeds()),
      dispatch(getBlockchains()),
      dispatch(getMarketplaces()),
    ])
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [dispatch]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setSelectedFile(e.target.files[0]); // only a single file is now set
      console.log("File selected:", e.target.files[0]);
    } else if (e.target.name === "feed") {
      const isNftFeed =
        feeds.find((feed) => feed._id === e.target.value)?.name === "NFT";
      setSelectedFeed(e.target.value);
      setProduct({ ...product, [e.target.name]: e.target.value });
      setShowMarketplace(isNftFeed);
      setTopicDisabled(false);
      setMarketplaceDisabled(true);
    } else if (e.target.name === "topic") {
      setProduct({ ...product, [e.target.name]: e.target.value });
      setBlockchainDisabled(false);
    } else if (e.target.name === "blockchain") {
      setSelectedBlockchain(e.target.value);
      setProduct({ ...product, [e.target.name]: e.target.value });
      if (showMarketplace) {
        setMarketplaceDisabled(false);
      } else {
        setOtherFieldsDisabled(false);
      }
    } else if (e.target.name === "marketplace") {
      if (e.target.value === "") {
        const { marketplace, ...rest } = product;
        setProduct(rest);
      } else {
        setProduct({ ...product, [e.target.name]: e.target.value });
      }
      setOtherFieldsDisabled(false);
    } else {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearErrors());

    let errorMessages = {};
    if (!product.title) errorMessages.title = "Title is required.";
    if (!product.tagline) errorMessages.tagline = "Tagline is required.";
    if (!product.description)
      errorMessages.description = "Description is required.";
    if (!product.url) errorMessages.url = "URL is required.";
    if (!product.dropDate) errorMessages.dropDate = "Drop date is required.";
    if (!product.feed) errorMessages.feed = "Feed is required.";
    if (!product.topic) errorMessages.topic = "Topic is required.";
    if (!product.blockchain)
      errorMessages.blockchain = "Blockchain is required.";
    if (showMarketplace && !product.marketplace) {
      errorMessages.marketplace = "Marketplace is required.";
    }
    if (!selectedFile) errorMessages.image = "An image is required.";

    setErrors(errorMessages);

    if (Object.keys(errorMessages).length === 0) {
      const feedObject = feeds.find((feed) => feed._id === product.feed);
      const topicObject = topics.find((topic) => topic._id === product.topic);
      const blockchainObject = blockchains.find(
        (blockchain) => blockchain._id === product.blockchain
      );
      const marketplaceObject = marketplaces.find(
        (marketplace) => marketplace._id === product.marketplace
      );

      let tags = {};

      if (feedObject) {
        tags.feed = {
          _id: feedObject._id,
          name: feedObject.name,
          acronym: feedObject.acronym,
        };
      }

      if (topicObject) {
        tags.topic = {
          _id: topicObject._id,
          name: topicObject.name,
          acronym: topicObject.acronym,
        };
      }

      if (blockchainObject) {
        tags.blockchain = {
          _id: blockchainObject._id,
          name: blockchainObject.name,
          acronym: blockchainObject.acronym,
        };
      }

      if (showMarketplace && marketplaceObject) {
        tags.marketplace = {
          _id: marketplaceObject._id,
          name: marketplaceObject.name,
          acronym: marketplaceObject.acronym,
        };
      }

      let finalProduct = {
        ...product,
        tags: tags,
        image: product.image,
      };

      finalProduct.tags = tags;

      if (finalProduct.marketplace === "") {
        delete finalProduct.marketplace;
      }

      let formData = new FormData();
      Object.entries(finalProduct).forEach(([key, value]) => {
        if (key !== "image") {
          if (key === "tags") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });

      if (selectedFile) {
        formData.append("image", selectedFile); // append the single file
      }

      dispatch(addProduct(formData))
        .then(() => {
          setOpen(true);
          setProduct({
            image: "",
            title: "",
            tagline: "",
            description: "",
            tags: {},
            url: "",
            dropDate: "",
            topic: "",
            feed: "",
            blockchain: "",
            marketplace: "",
          });
        })
        .catch((err) => console.log(err));
    }
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
            <FormControl
              fullWidth
              className={classes.formControl}
              error={errors.feed ? true : false}
            >
              <InputLabel id="demo-simple-select-feed-label">Feed</InputLabel>
              <Select
                labelId="demo-simple-select-feed-label"
                id="demo-simple-select-feed"
                value={product.feed}
                onChange={handleChange}
                name="feed"
              >
                {feeds
                  .filter((feed) => feed !== undefined)
                  .map((feed) => (
                    <MenuItem value={feed._id} key={feed._id}>
                      {feed.name}
                    </MenuItem>
                  ))}
              </Select>
              {errors.feed && <FormHelperText>{errors.feed}</FormHelperText>}
            </FormControl>

            <FormControl
              fullWidth
              className={classes.formControl}
              disabled={topicDisabled}
              error={errors.topic ? true : false}
            >
              <InputLabel id="demo-simple-select-topic-label">Topic</InputLabel>
              <Select
                labelId="demo-simple-select-topic-label"
                id="demo-simple-select-topic"
                value={product.topic}
                onChange={handleChange}
                name="topic"
              >
                {topics
                  .filter(
                    (topic) =>
                      topic !== undefined && topic.feed === selectedFeed
                  )
                  .map((topic) => (
                    <MenuItem value={topic._id} key={topic._id}>
                      {topic.name}
                    </MenuItem>
                  ))}
              </Select>
              {errors.topic && <FormHelperText>{errors.topic}</FormHelperText>}
            </FormControl>

            <FormControl
              fullWidth
              className={classes.formControl}
              disabled={blockchainDisabled}
              error={errors.blockchain ? true : false}
            >
              <InputLabel id="demo-simple-select-blockchain-label">
                Blockchain
              </InputLabel>
              <Select
                labelId="demo-simple-select-blockchain-label"
                id="demo-simple-select-blockchain"
                value={product.blockchain}
                onChange={handleChange}
                name="blockchain"
              >
                {blockchains
                  .filter((blockchain) => blockchain !== undefined)
                  .map((blockchain) => (
                    <MenuItem value={blockchain._id} key={blockchain._id}>
                      {blockchain.name}
                    </MenuItem>
                  ))}
              </Select>
              {errors.blockchain && (
                <FormHelperText>{errors.blockchain}</FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              className={classes.formControl}
              disabled={marketplaceDisabled}
              error={errors.marketplace ? true : false}
              style={{ display: showMarketplace ? "inline-flex" : "none" }}
            >
              <InputLabel id="demo-simple-select-marketplace-label">
                Marketplace
              </InputLabel>
              <Select
                labelId="demo-simple-select-marketplace-label"
                id="demo-simple-select-marketplace"
                value={product.marketplace}
                onChange={handleChange}
                name="marketplace"
                required={showMarketplace}
              >
                {marketplaces
                  .filter(
                    (marketplace) =>
                      marketplace !== undefined &&
                      marketplace.blockchain === selectedBlockchain
                  )
                  .map((marketplace) => (
                    <MenuItem value={marketplace._id} key={marketplace._id}>
                      {marketplace.name}
                    </MenuItem>
                  ))}
              </Select>
              {errors.marketplace && (
                <FormHelperText>{errors.marketplace}</FormHelperText>
              )}
            </FormControl>
            <input
              accept="image/*"
              className={classes.input}
              style={{ display: "none" }}
              id="raised-button-file"
              type="file" // removed "multiple" attribute
              onChange={handleChange}
              name="image"
              disabled={otherFieldsDisabled}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="contained"
                component="span"
                className={classes.button}
                disabled={otherFieldsDisabled}
              >
                Upload
              </Button>
            </label>
            <TextField
              error={errors.title ? true : false}
              helperText={errors.title}
              name="title"
              value={product.title}
              onChange={handleChange}
              label="Product Title"
              variant="outlined"
              fullWidth
              disabled={otherFieldsDisabled}
            />
            <TextField
              error={errors.tagline ? true : false}
              helperText={errors.tagline}
              name="tagline"
              value={product.tagline}
              onChange={handleChange}
              label="Product Tagline"
              variant="outlined"
              fullWidth
              disabled={otherFieldsDisabled}
            />
            <TextField
              error={errors.description ? true : false}
              helperText={errors.description}
              name="description"
              value={product.description}
              onChange={handleChange}
              label="Product Description"
              variant="outlined"
              fullWidth
              disabled={otherFieldsDisabled}
            />
            <TextField
              error={errors.url ? true : false}
              helperText={errors.url}
              name="url"
              value={product.url}
              onChange={handleChange}
              label="Product URL"
              variant="outlined"
              fullWidth
              disabled={otherFieldsDisabled}
            />
            <TextField
              error={errors.dropDate ? true : false}
              helperText={errors.dropDate}
              name="dropDate"
              value={product.dropDate}
              onChange={handleChange}
              label="Product Drop Date"
              variant="outlined"
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              disabled={otherFieldsDisabled}
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

          {productErrors && <Alert severity="error">{productErrors.msg}</Alert>}
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductForm;
