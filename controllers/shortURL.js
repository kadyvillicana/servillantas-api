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
        _shortURL = `${process.env.MAIN_URL}url/${URLCode}`;
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
 * If the code is not found, return to the main page.
 */
exports.getURL = (req, res, next) => {
  const URLCode = req.params.code;
  ShortURL.findOne({ URLCode }, (err, _shortURL) => {
    if (err) {
      return next(err);
    }

    let location = process.env.app_url;
    if (_shortURL) {
      location = _shortURL.originalURL;
    }
    res.writeHead(301, {
      'Location': location
    });
    res.end();
  });
}