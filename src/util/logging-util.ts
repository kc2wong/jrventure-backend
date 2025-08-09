import { context, trace } from '@opentelemetry/api';
import winston from 'winston';

interface Logger {
  info: (message: string) => void;
  debug: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
}

const traceFormat = winston.format((info) => {
  const span = trace.getSpan(context.active());
  if (span) {
    const spanCtx = span.spanContext();
    info.traceId = spanCtx.traceId;
    info.spanId = spanCtx.spanId;
  }
  return info;
});

const winstonLogger = winston.createLogger({
  format: winston.format.combine(
    traceFormat(), // Inject traceId & spanId
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

const createLoggerWinston = (): Logger => ({
  info: (message: string) => {
    winstonLogger.log('info', message);
  },
  debug: (message: string) => {
    winstonLogger.log('debug', message);
  },
  warn: (message: string) => {
    winstonLogger.log('warn', message);
  },
  error: (message: string) => {
    winstonLogger.log('error', message);
  },
});

export const logger: Logger = createLoggerWinston();
