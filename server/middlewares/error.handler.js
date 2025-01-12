import fs from "fs";

const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    const errorLogStream = fs.createWriteStream('./logs/error.log', { flags: 'a' });
    const log = `[${new Date().toISOString()}] ${500} - ${message} - ${req.originalUrl} - ${req.method}`;
	errorLogStream.write(log + '\n');

    const response = {
        success: false,
        message: message,
        data: []
    };

    res.status(statusCode).send(response);
};

export default errorHandler;
