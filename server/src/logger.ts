import { createLogger, transports, format } from "winston";
import { resolve } from "path";

const { combine, timestamp, printf } = format;

const logger = createLogger({
    format : combine(
        timestamp(),
        printf(({ message, timestamp, level, stack }) => {
            if (stack) {
                return `${timestamp} ${level}: ${message}\n${"-".repeat(100)}\n${stack}\n${"-".repeat(100)}`;
            }
            return `${timestamp} ${level}: ${message}\n`
        })
    ),
    transports : [
        new transports.Console(),
        new transports.File({ filename : resolve(process.cwd(), "logs", "error.log") })
    ]
});

export default logger;
