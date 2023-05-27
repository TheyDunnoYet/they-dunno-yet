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
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  storage: multerS3({
    s3: s3,
    bucket: process.env.SPACES_BUCKET_NAME,
    acl: "public-read",
    key: function (request, file, cb) {
      console.log("Uploading file:", file);
      cb(null, new Date().toISOString() + "-" + file.originalname);
    },
  }),
}).single("image");

function checkFileType(file, cb) {
  // Check file type
  // Allow jpeg, jpg, png, and gifs
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

module.exports = upload;
