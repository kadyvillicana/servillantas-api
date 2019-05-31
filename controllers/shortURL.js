const ShortURL          = require('../models/shortURL'),
      validURL          = require('valid-url'),
      shortId           = require('shortid');

/**
 * Function to create a short url from a long url.
 * 
 * @returns {Object} Model ShortURL
 */
exports.addURL = (req, res, next) => {  

  const { longURL } = req.body;

  if (validURL.isUri(longURL)) {

    const URLCode = shortId.generate();
    ShortURL.findOne({ originalURL: longURL }, (err, _shortURL) => {
      if (err) {
        return next(err);
      }
  
      // If the url from the request already exists, return the short url
      // Else generate a new short url
      if (_shortURL) {
        return res.status(200).json({ data: _shortURL, success: true });
      } else {
        _shortURL = `${process.env.APP_URL}s/${URLCode}`;
        ShortURL.create({ originalURL: longURL, URLCode, shortURL: _shortURL, }, (err, _newShortURL) => {
          if (err) {
            return next(err);
          }
  
          return res.status(200).json({ data: _newShortURL, success: true });
        });
      }
    });
  } else {
    res.status(400).json({ error: "Invalid URL" });
  }

}

/**
 * Endpoint to redirect to the original URL given the code
 * in the short url.
 * 
 * If the code is not found, return error.
 */
exports.getURL = (req, res, next) => {
  const URLCode = req.params.code;
  ShortURL.findOne({ URLCode }, (err, _shortURL) => {
    if (err) {
      return next(err);
    }

    if (!_shortURL) {
      return res.status(404).json({ error: 'Code not found' });
    }
    
    return res.status(200).json({ data: _shortURL.originalURL, success: true });
  });
}