'use strict';

/**
 * Given a list of field names, will check the request body of a JSON
 * request to see if all of the fields are there. If not, will report
 * the missing fields and give a 400 error response.
 *
 * Assumes bodyParser middleware already in place above it.
 */
module.exports = function validateJSONFields(fields) {
    return (req, res, next) => {
        if (req.header('content-type') !== 'application/json') {
            next();
        }
        console.log('json validator:', req.body);
        let missingFields = [];
        for (let field of fields) {
            if (req.body[field] === undefined) {
                missingFields.push(field);
            }
        }
        console.log('found missing fields');
        if (missingFields.length > 0) {
            res.status(400).send("Missing JSON fields in request: " +
                missingFields.join(", "));
            return;
        }
        next();
    };
}
