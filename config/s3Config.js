const AWS = require("aws-sdk");
require("dotenv").config();

// Configure AWS SDK with your DigitalOcean Spaces credentials
AWS.config.update({
  accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY,
  endpoint: new AWS.Endpoint(process.env.SPACES_ENDPOINT),
});

// Create and configure an instance of the S3 service
const s3 = new AWS.S3();

module.exports = s3;
