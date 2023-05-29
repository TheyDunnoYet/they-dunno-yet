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
  fileFilter: (req, file, cb) => {
    // validate file
    console.log("file data", file);
    const isValid = true;
    cb(null, isValid);
    // cb(new Error("I don't have a clue!")); can also throw errors
  },
  storage: multerS3({
    s3: new aws.S3({
      accessKeyId: process.env.SPACES_ACCESS_KEY_ID || null,
      secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY || null,
      endpoint: process.env.SPACES_ENDPOINT || null,
      signatureVersion: "v4",
    }),
    bucket: process.env.SPACES_BUCKET_NAME || null,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      // save file to Spaces, you can use / to add folders directory
      const fileName = Date.now().toString(); //file.originalname;
      cb(null, `test/${fileName}`);
    },
  }),
}).array("image", 1);

module.exports = upload;
