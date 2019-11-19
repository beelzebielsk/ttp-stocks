'use strict';
const jwt = require('jsonwebtoken');

module.exports = function verifyJWTToken(secretOrPublicKey) {
    return (req, res, next) => {
        console.log("verifying jwt token");
        if (req.header('authorization') === undefined) {
            console.log("No auth header.");
            res.status(401).send("Need to present authorization token.");
            return;
        }
        console.log("Checking auth header contents");
        const auth = req.header('authorization');
        if (!auth.startsWith("Bearer")) {
            res.status(400).send("Authorization header needs to start with 'Bearer'.");
            return;
        }
        const token = auth.slice('Bearer '.length);
        try {
            const decoded = jwt.verify(token, secretOrPublicKey);
            req.credentials = decoded;
            next();
        } catch (err) {
            if (err.name === 'JsonWebTokenError') {
                res.status(401).send("Invalid token submitted.");
                return;
            }
            next(err);
        }
    }
}
