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
    images: [""],
    title: "",
    tagline: "",
    description: "",
    tags: [""],
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

  // states to handle the currently selected feed and blockchain
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [selectedBlockchain, setSelectedBlockchain] = useState(null);

  // Add the showMarketplace state
  const [showMarketplace, setShowMarketplace] = useState(false);

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
    if (e.target.name === "images") {
      let imageArray = e.target.value
        ? e.target.value.split(",").map((item) => item.trim())
        : [""];
      setProduct({ ...product, [e.target.name]: imageArray });
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
        // If NFT feed is selected
        setMarketplaceDisabled(false);
      } else {
        setOtherFieldsDisabled(false);
      }
    } else if (e.target.name === "marketplace") {
      setProduct({ ...product, [e.target.name]: e.target.value });
      setOtherFieldsDisabled(false);
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
          feed: "",
          blockchain: "",
          marketplace: "",
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
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel id="demo-simple-select-feed-label">Feed</InputLabel>
              <Select
                labelId="demo-simple-select-feed-label"
                id="demo-simple-select-feed"
                value={product.feed}
                onChange={handleChange}
                name="feed"
                required
              >
                {feeds
                  .filter((feed) => feed !== undefined) // filter out undefined feeds
                  .map((feed) => (
                    <MenuItem value={feed._id} key={feed._id}>
                      {feed.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              className={classes.formControl}
              disabled={topicDisabled}
            >
              <InputLabel id="demo-simple-select-topic-label">Topic</InputLabel>
              <Select
                labelId="demo-simple-select-topic-label"
                id="demo-simple-select-topic"
                value={product.topic}
                onChange={handleChange}
                name="topic"
                required
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
            </FormControl>

            <FormControl
              fullWidth
              className={classes.formControl}
              disabled={blockchainDisabled}
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
                required
              >
                {blockchains
                  .filter((blockchain) => blockchain !== undefined) // filter out undefined blockchains
                  .map((blockchain) => (
                    <MenuItem value={blockchain._id} key={blockchain._id}>
                      {blockchain.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              className={classes.formControl}
              disabled={marketplaceDisabled}
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
                required
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
            </FormControl>
            <TextField
              name="images"
              value={product.images[0]}
              onChange={handleChange}
              label="Product Images"
              variant="outlined"
              fullWidth
              disabled={otherFieldsDisabled}
            />
            <TextField
              name="title"
              value={product.title}
              onChange={handleChange}
              label="Product Title"
              variant="outlined"
              fullWidth
              disabled={otherFieldsDisabled}
            />
            <TextField
              name="tagline"
              value={product.tagline}
              onChange={handleChange}
              label="Product Tagline"
              variant="outlined"
              fullWidth
              disabled={otherFieldsDisabled}
            />
            <TextField
              name="description"
              value={product.description}
              onChange={handleChange}
              label="Product Description"
              variant="outlined"
              fullWidth
              disabled={otherFieldsDisabled}
            />
            <TextField
              name="tags"
              value={product.tags[0]}
              onChange={handleChange}
              label="Product Tags"
              variant="outlined"
              fullWidth
              disabled={otherFieldsDisabled}
            />
            <TextField
              name="url"
              value={product.url}
              onChange={handleChange}
              label="Product URL"
              variant="outlined"
              fullWidth
              disabled={otherFieldsDisabled}
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
