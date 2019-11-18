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

function verifyJWTToken(secretOrPublicKey) {
    return (req, res, next) => {
        try {
            validateAuthHeader(req);
        } catch (err) {
            if (err.message === "No Authorization header on request.") {
                handleAbsentHeader(req, res);
            } else if (err.message === "Authorization header is malformed: should start with 'Bearer'.") {
                handleMalformedHeader(req, res);
            }
            return;
        }

        const token = extractToken(req);

        try {
            const decoded = jwt.verify(token, secretOrPublicKey);
            req.credentials = decoded;
            next();
        } catch (err) {
            if (err.name === 'JsonWebTokenError') {
                handleInvalidToken(req, res)
            } else {
                next(err);
            }
        }
    }
}

function validateAuthHeader(req) {
    console.log("verifying jwt token");
    if (req.header('authorization') === undefined) {
        console.log("No auth header.");
        throw new Error("No Authorization header on request.");
    } 
    console.log("Checking auth header contents");
    const auth = req.header('authorization');
    if (!auth.startsWith("Bearer")) {
        throw new Error("Authorization header is malformed: should start with 'Bearer'.")
    }
}

function extractToken(req) {
    const token = req.header('authorization').slice('Bearer '.length);
    return token;
}

function handleAbsentHeader(req, res) {
    res.status(401).send("Need to present authorization token.");
}
function handleMalformedHeader(req, res) {
    res.status(400).send("Authorization header needs to start with 'Bearer'.");
}
function handleInvalidToken(req, res) {
    res.status(401).send("Invalid token submitted.");
}

/* tasks done in verifyJWTToken:
 * - validate the header
 *      - does it contain the Authorization header?
 *      - is the authorization header well formed?
 * - extract the token from the request
 * - decode the token
 *      - handle malformed token
 *

