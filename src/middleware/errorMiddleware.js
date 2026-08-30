const sendResponse = require("../utils/response");

const errorHandler = (err, req, res, next) => {
    console.error(err);

 
    sendResponse(res,500, false,"Something went wrong");
};

module.exports = errorHandler;