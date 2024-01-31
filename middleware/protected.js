const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.token) {
      return next();
    } else {
      console.log("Redirecting to /login because session or token is missing");
      return res.redirect('/login');
    }
};

module.exports = isAuthenticated;