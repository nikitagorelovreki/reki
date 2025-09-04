#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class SimpleLogger {
  constructor(scriptName, options = {}) {
    this.scriptName = scriptName;
    this.startTime = new Date();
    this.logDir = options.logDir || path.join(process.cwd(), 'logs/scripts');
    this.enableFile = options.enableFile !== false;
    this.enableConsole = options.enableConsole !== false;
    
    if (this.enableFile) {
      this.ensureLogDir();
      this.logFile = path.join(this.logDir, `${scriptName}-${this.getDateString()}.log`);
    }
    
    this.log('🚀 Starting script: ' + scriptName, 'INFO');
  }

  getDateString() {
    return new Date().toISOString().split('T')[0];
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = this.getTimestamp();
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${this.scriptName}] ${level}: ${message}${metaStr}`;
  }

  log(message, level = 'INFO', meta = {}) {
    const formattedMessage = this.formatMessage(level, message, meta);
    
    if (this.enableConsole) {
      console.log(formattedMessage);
    }
    
    if (this.enableFile && this.logFile) {
      try {
        fs.appendFileSync(this.logFile, formattedMessage + '\n');
      } catch (error) {
        console.error('Failed to write to log file:', error.message);
      }
    }
  }

  info(message, meta = {}) {
    this.log(message, 'INFO', meta);
  }

  error(message, error, meta = {}) {
    const errorMeta = error ? { 
      error: error.message, 
      stack: error.stack?.split('\n').slice(0, 5).join('\n'),
      ...meta 
    } : meta;
    this.log(message, 'ERROR', errorMeta);
  }

  warn(message, meta = {}) {
    this.log(message, 'WARN', meta);
  }

  step(stepName, meta = {}) {
    this.info('📋 Step: ' + stepName, meta);
  }

  success(message, meta = {}) {
    this.info('✅ ' + message, meta);
  }

  failure(message, error, meta = {}) {
    this.error('❌ ' + message, error, meta);
  }

  command(command, workingDir) {
    this.info('🔧 Running: ' + command, { 
      command, 
      cwd: workingDir || process.cwd() 
    });
  }

  commandResult(command, exitCode, output, errorOutput) {
    const level = exitCode === 0 ? 'INFO' : 'ERROR';
    const emoji = exitCode === 0 ? '✅' : '❌';
    
    this.log(`${emoji} Command finished: ${command}`, level, {
      command,
      exitCode,
      output: output?.substring(0, 500),
      error: errorOutput?.substring(0, 500)
    });
  }

  finish(success = true) {
    const duration = Date.now() - this.startTime.getTime();
    const message = success 
      ? `🎉 Script completed: ${this.scriptName} (${duration}ms)`
      : `💥 Script failed: ${this.scriptName} (${duration}ms)`;
    
    this.log(message, success ? 'INFO' : 'ERROR', {
      duration,
      success
    });
  }

  // Helper to run commands with logging
  async runCommand(command, options = {}) {
    const { spawn } = require('child_process');
    const workingDir = options.cwd || process.cwd();
    
    this.command(command, workingDir);
    
    return new Promise((resolve) => {
      const [cmd, ...args] = command.split(' ');
      const child = spawn(cmd, args, {
        cwd: workingDir,
        stdio: 'pipe',
        shell: true
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        if (options.showOutput !== false) {
          process.stdout.write(output);
        }
      });

      child.stderr?.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        if (options.showOutput !== false) {
          process.stderr.write(output);
        }
      });

      child.on('close', (code) => {
        this.commandResult(command, code || 0, stdout, stderr);
        resolve({ 
          exitCode: code || 0, 
          stdout: stdout.trim(), 
          stderr: stderr.trim() 
        });
      });

      child.on('error', (error) => {
        this.commandResult(command, 1, stdout, error.message);
        resolve({ 
          exitCode: 1, 
          stdout: stdout.trim(), 
          stderr: error.message 
        });
      });
    });
  }
}

module.exports = { SimpleLogger };

// CLI usage
if (require.main === module) {
  const scriptName = process.argv[2] || 'test-script';
  const logger = new SimpleLogger(scriptName);
  
  logger.info('Logger test started');
  logger.step('Test step');
  logger.success('Test success');
  logger.warn('Test warning');
  logger.error('Test error', new Error('Test error message'));
  logger.finish();
}
