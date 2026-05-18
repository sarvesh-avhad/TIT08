const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../../logs.txt");

const logger = (req, res, next) => {
    const log = `
[${new Date().toISOString()}]
Method: ${req.method}
URL: ${req.url}
`;

    fs.appendFileSync(logFilePath, log);

    next();
};

module.exports = logger;