"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const winston_1 = __importDefault(require("winston"));
const statusRoute_1 = __importDefault(require("./Routes/statusRoute"));
const application = express_1.default();
const PORT = process.env.port || 8123;
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.json(),
    transports: [new winston_1.default.transports.Console({ format: winston_1.default.format.simple() })]
});
application.use(statusRoute_1.default());
application.listen(PORT, () => {
    logger.info(`API Server listening on ${PORT}`);
});
//# sourceMappingURL=index.js.map