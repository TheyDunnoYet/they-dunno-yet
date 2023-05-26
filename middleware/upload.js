const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
require("dotenv").config();

aws.config.update({
  accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY,
  region: process.env.SPACES_REGION,
});

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint("nyc3.digitaloceanspaces.com");
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.SPACES_BUCKET_NAME,
    acl: "public-read",
    key: function (request, file, cb) {
      console.log("Request in multer: ", req);
      console.log("File in multer: ", file);
      cb(null, new Date().toISOString() + "-" + file.originalname);
    },
  }),
}).array("images", 1);

module.exports = upload;
