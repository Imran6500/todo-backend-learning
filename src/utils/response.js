const sendResponse = (res, statusCode, success, message, data = null, pagination = null) => {
    return res.status(statusCode).json({
        success,
        message,
        data,
        pagination
    });
};

module.exports = sendResponse;