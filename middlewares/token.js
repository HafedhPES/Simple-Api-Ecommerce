const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authheader = req.headers.token
    if (authheader) {
        const token = authheader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) res.status(403).json('token invalide')
            req.user = user
            next()
        })
    } else {
        res.status(401).json('non authentifié')
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin)
            next()
        else
            res.status(403).json('not allowed for you')
    })

}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("Only Admin can do that")
        }

    })

}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin }