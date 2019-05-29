const ShortURL          = require('../models/shortURL'),
      validURL          = require('valid-url'),
      shortId           = require('shortid');

exports.addURL = (req, res, next) => {
  const { originalURL } = req.body;
  
  if (validURL.isUri(originalURL)) {
    const URLCode = shortId.generate();
    ShortURL.findOne({ originalURL }, (err, _shortURL) => {
      if (err) {
        return next(err);
      }

      if (_shortURL) {
        return res.status(200).json({ data: _shortURL, success: true });
      } else {
        _shortURL = `${process.env.MAIN_URL}url/${URLCode}`;
        ShortURL.create({ originalURL, URLCode, shortURL: _shortURL, }, (err, _newShortURL) => {
          if (err) {
            return next(err);
          }

          return res.status(200).json({ data: _newShortURL, success: true });
        });
      }
    });
  } else {
    return res.status(400).json({ error: "Invalid url" });
  }
}

exports.getURL = async (req, res, next) => {
  const URLCode = req.params.code;
    const _shortURL = await ShortURL.findOne({ URLCode });
    if (_shortURL) {
      res.writeHead(301, {
        'Location': _shortURL.originalURL
      });
      res.end();
    }
    else {
      return res.status(404).json({ error: "Not found" });
    }
}