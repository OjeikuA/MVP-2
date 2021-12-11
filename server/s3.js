const token = require('./config.js')
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');


const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({

  region,
  accessKeyId,
  secretAccessKey
});

const uploadToS3 = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const fileDetails = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  }

  return s3.upload(fileDetails).promise();
}

module.exports = {uploadToS3}


