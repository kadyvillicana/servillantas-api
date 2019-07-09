const passport                  = require('passport');

exports.login = (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) {
    res.send(401);
    return;
  }

  passport.authenticate('local', { session: false }, (err, friend) => {
    if (err || !friend) {
      return res.status(401).json({
        message: "Unauthorized",
        friend
      });
    }
    const token = friend.generateJWT();

    return res.status(200).json({
      message: "Logged in",
      data: friend.authJSON(),
      token
    });

  })(req, res);
};

exports.logout = (req, res) => {
  req.logout();
  res.send({ message: "sign out" })
}

  
