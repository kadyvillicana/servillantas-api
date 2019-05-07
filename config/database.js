require('dotenv').config();
module.exports = function(){
  return {
    url: process.env.DB_URL,
    options : {
      useNewUrlParser: true,
      user: process.env.DB_USER,
      pass: process.env.DB_PASSWORD
    }
  }
}
