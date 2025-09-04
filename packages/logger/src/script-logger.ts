import { createLogger } from './index';
import winston from 'winston';

export interface ScriptLoggerConfig {
  scriptName: string;
  logLevel?: string;
  enableFile?: boolean;
  enableConsole?: boolean;
}

export class ScriptLogger {
  private logger: winston.Logger;
  private scriptName: string;
  private startTime: Date;

  constructor(config: ScriptLoggerConfig) {
    this.scriptName = config.scriptName;
    this.startTime = new Date();
    
    this.logger = createLogger({
      service: `script-${config.scriptName}`,
      level: config.logLevel || 'info',
      enableFile: config.enableFile !== false,
      enableConsole: config.enableConsole !== false,
      logDir: 'logs/scripts'
    });

    this.info(`🚀 Starting script: ${this.scriptName}`);
  }

  info(message: string, meta?: any) {
    this.logger.info(message, { script: this.scriptName, ...meta });
    return this;
  }

  error(message: string, error?: Error, meta?: any) {
    const errorMeta = error ? {
      error: error.message,
      stack: error.stack,
      ...meta
    } : meta;
    
    this.logger.error(message, { script: this.scriptName, ...errorMeta });
    return this;
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, { script: this.scriptName, ...meta });
    return this;
  }

  debug(message: string, meta?: any) {
    this.logger.debug(message, { script: this.scriptName, ...meta });
    return this;
  }

  step(stepName: string, meta?: any) {
    this.info(`📋 Step: ${stepName}`, meta);
    return this;
  }

  success(message: string, meta?: any) {
    this.info(`✅ ${message}`, meta);
    return this;
  }

  failure(message: string, error?: Error, meta?: any) {
    this.error(`❌ ${message}`, error, meta);
    return this;
  }

  command(command: string, workingDir?: string) {
    this.info(`🔧 Running command: ${command}`, { 
      command, 
      cwd: workingDir || process.cwd() 
    });
    return this;
  }

  commandResult(command: string, exitCode: number, output?: string, error?: string) {
    const level = exitCode === 0 ? 'info' : 'error';
    const emoji = exitCode === 0 ? '✅' : '❌';
    
    this.logger.log(level, `${emoji} Command finished: ${command}`, {
      script: this.scriptName,
      command,
      exitCode,
      output: output?.substring(0, 1000), // Truncate long output
      error: error?.substring(0, 1000)
    });
    return this;
  }

  finish(success: boolean = true) {
    const duration = Date.now() - this.startTime.getTime();
    const message = success 
      ? `🎉 Script completed successfully: ${this.scriptName} (${duration}ms)`
      : `💥 Script failed: ${this.scriptName} (${duration}ms)`;
    
    this.logger.info(message, {
      script: this.scriptName,
      duration,
      success
    });
  }

  // Pipe streams to logger
  pipeStdout(stream: NodeJS.ReadableStream) {
    stream.on('data', (data) => {
      const message = data.toString().trim();
      if (message) {
        this.info(`STDOUT: ${message}`);
      }
    });
    return this;
  }

  pipeStderr(stream: NodeJS.ReadableStream) {
    stream.on('data', (data) => {
      const message = data.toString().trim();
      if (message) {
        this.error(`STDERR: ${message}`);
      }
    });
    return this;
  }
}

export function createScriptLogger(scriptName: string, config: Omit<ScriptLoggerConfig, 'scriptName'> = {}): ScriptLogger {
  return new ScriptLogger({ scriptName, ...config });
}
