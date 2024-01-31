const isLogged = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.redirect('/login');
    }

    const token = req.headers.authorization.split(' ')[1];
    
    if((token === req.session.token)) {
        return next();
    } else {
        return res.status(401).json({ msg: 'Incorrect authorization token!' });
    }
}

module.exports = isLogged;