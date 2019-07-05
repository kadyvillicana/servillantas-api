require('dotenv').config();
module.exports.config = {
  url: process.env.ACTIVE_DIRECTORY_URL,
  baseDN: process.env.BASE_DN,
  username: process.env.ACTIVE_DIRECTORY_USERNAME,
  password: process.env.ACTIVE_DIRECTORY_PASSWORD,
}
