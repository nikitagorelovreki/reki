import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

export interface LoggerConfig {
  level?: string;
  service?: string;
  logDir?: string;
  enableConsole?: boolean;
  enableFile?: boolean;
  maxSize?: string;
  maxFiles?: string;
}

export class RekiLogger {
  private static instances: Map<string, winston.Logger> = new Map();
  
  static createLogger(config: LoggerConfig = {}): winston.Logger {
    const {
      level = 'info',
      service = 'reki',
      logDir = path.join(process.cwd(), 'logs'),
      enableConsole = true,
      enableFile = true,
      maxSize = '20m',
      maxFiles = '14d'
    } = config;

    const instanceKey = `${service}-${level}`;
    
    if (RekiLogger.instances.has(instanceKey)) {
      return RekiLogger.instances.get(instanceKey)!;
    }

    // Ensure logs directory exists
    if (enableFile && !fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const transports: winston.transport[] = [];

    // Console transport with colors
    if (enableConsole) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.colorize({ all: true }),
            winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
              const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
              return `${timestamp} [${service}] ${level}: ${message} ${metaStr}`;
            })
          )
        })
      );
    }

    // File transport with rotation
    if (enableFile) {
      // Combined logs
      transports.push(
        new DailyRotateFile({
          filename: path.join(logDir, `${service}-%DATE%.log`),
          datePattern: 'YYYY-MM-DD',
          maxSize,
          maxFiles,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        })
      );

      // Error logs
      transports.push(
        new DailyRotateFile({
          filename: path.join(logDir, `${service}-error-%DATE%.log`),
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxSize,
          maxFiles,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        })
      );
    }

    const logger = winston.createLogger({
      level,
      defaultMeta: { service },
      transports,
      // Handle exceptions and rejections
      exceptionHandlers: enableFile ? [
        new DailyRotateFile({
          filename: path.join(logDir, `${service}-exceptions-%DATE%.log`),
          datePattern: 'YYYY-MM-DD',
          maxSize,
          maxFiles
        })
      ] : [],
      rejectionHandlers: enableFile ? [
        new DailyRotateFile({
          filename: path.join(logDir, `${service}-rejections-%DATE%.log`),
          datePattern: 'YYYY-MM-DD',
          maxSize,
          maxFiles
        })
      ] : []
    });

    RekiLogger.instances.set(instanceKey, logger);
    return logger;
  }

  static getLogger(service: string = 'reki'): winston.Logger {
    return RekiLogger.createLogger({ service });
  }
}

// Convenience functions
export const createLogger = RekiLogger.createLogger;
export const getLogger = RekiLogger.getLogger;

// Default logger
export const logger = RekiLogger.createLogger();

export default RekiLogger;
