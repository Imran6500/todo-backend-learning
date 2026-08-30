const sendResponse = require("../utils/response");

const notFound = (req, res) => {
    return sendResponse(
        res,
        404,
        false,
        "Route not found"
    );
};

module.exports = notFound;