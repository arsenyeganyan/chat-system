const isLogged = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(403).json({ msg: 'No credentials have been provided!' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const { randId } = req.body; 
    
    if((token === req.session.token) && (randId === req.session.randId)) {
        return next();
    } else {
        return res.status(401).json({ msg: 'Invalid token provided!' });
    }
}

module.exports = isLogged;