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
        if (!isJSONRequest(req)) {
            next();
            return;
        }
        const missingFields = getMissingFields(req.body, fields);
        if (missingFields.length > 0) {
            handleMissingFields(res, missingFields);
            return;
        }  
        next();
    };
}

function isJSONRequest(req) {
    return req.header('content-type') === 'application/json';
}

function getMissingFields(requestBody, fields) {
    let missingFields = [];
    for (let field of fields) {
        console.log(`Checking for ${field}`);
        if (requestBody[field] === undefined) {
            missingFields.push(field);
        }
    }
    return missingFields;
}

function handleMissingFields(res, missingFields) {
    let errMsg = "Missing JSON fields in request: " + 
        missingFields.join(", ");
    res.status(400).send(errMsg);
}
