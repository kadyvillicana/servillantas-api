const AWS         = require('aws-sdk');
const awsConfig   = require('../config/aws');
const shortId     = require('shortid');

console.log(awsConfig);

AWS.config.update(awsConfig.keys);

const s3 = new AWS.S3();

module.exports = async (image) => {

  const base64Data = new Buffer.from(getImageCode(image), 'base64');
  const extension = getImageExtension(image);
  const params = {
    Bucket: awsConfig.bucket,
    Key: `${shortId.generate()}.${extension}`,
    ACL:'public-read',
    Body: base64Data,
    ContentEncoding: 'base64',
    ContentType: `image/${extension}`
  }

  try {
    const response = await s3.upload(params).promise();
    return response.Location;
  } catch (err) {
    throw err;
  }
}

/**
 * Get the extension of the image
 * 
 * @param {string} image base64
 * 
 * @returns {string} png, svg, jpg, etc
 */
const getImageExtension = (image) => {
  const pos = image.indexOf(';');
  const type = image.substr(0, pos).split(':', )[1];
  const extension = type.split('/')[1];

  return extension;
}

/**
 * Function to get the text of the image
 * without the type and extension.
 * 
 * @param {string} image base64
 * 
 * @returns {string} the code that will be
 * converted to the image
 */
const getImageCode = (image) => {
  return image.replace(/^data:image\/\w+;base64,/, '');
}