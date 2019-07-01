/**
 * Validate data is base64.
 * 
 * NOTE:
 * (.+)? should instead be:
 * (?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+\/]{3}=)?
 * 
 * but with big images (5 mb and above) the regex throws an error
 * (Maximum call stack size exceeded inside regex).
 */
module.exports = (data) => {
  return /^(data:\w+\/[a-zA-Z+\-.]+;base64,)?(.+)?$/gi.exec(data);
}