import chalk from 'chalk';

/**
 * Log levels supported by the logger
 */
export enum LogLevel {
  INFO = 'info',
  SUCCESS = 'success',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug'
}

/**
 * Options for creating a logger instance
 */
export interface LoggerOptions {
  /**
   * The name of the service or module that will be displayed in logs
   */
  serviceName: string;
  
  /**
   * Whether to enable debug logs (disabled by default)
   */
  enableDebug?: boolean;
}

/**
 * A centralized logger utility for consistent, colorful logging
 */
export class Logger {
  private serviceName: string;
  private enableDebug: boolean;

  /**
   * Create a new logger instance
   * @param options Logger configuration options
   */
  constructor(options: LoggerOptions) {
    this.serviceName = options.serviceName;
    this.enableDebug = options.enableDebug || false;
  }

  /**
   * Format a value for logging, handling objects and errors
   * @param value The value to format
   * @returns Formatted string representation
   */
  private formatValue(value: any): string {
    if (value instanceof Error) {
      return value.stack || value.message;
    }
    
    if (typeof value === 'object' && value !== null) {
      try {
        return JSON.stringify(value, null, 2);
      } catch (e) {
        return String(value);
      }
    }
    
    return String(value);
  }

  /**
   * Get the colored service name prefix
   * @returns Formatted service name
   */
  private getServicePrefix(): string {
    return chalk.blue.bold(`${this.serviceName}:`);
  }

  /**
   * Log an informational message
   * @param message The message to log
   * @param data Optional data to include
   */
  public info(message: string, data?: any): void {
    const prefix = this.getServicePrefix();
    const formattedMessage = chalk.cyan(message);
    
    if (data !== undefined) {
      const formattedData = chalk.yellow(this.formatValue(data));
      console.log(prefix, formattedMessage, formattedData);
    } else {
      console.log(prefix, formattedMessage);
    }
  }

  /**
   * Log a success message
   * @param message The message to log
   * @param data Optional data to include
   */
  public success(message: string, data?: any): void {
    const prefix = this.getServicePrefix();
    const formattedMessage = chalk.green(message);
    
    if (data !== undefined) {
      const formattedData = chalk.yellow(this.formatValue(data));
      console.log(prefix, formattedMessage, formattedData);
    } else {
      console.log(prefix, formattedMessage);
    }
  }

  /**
   * Log a warning message
   * @param message The message to log
   * @param data Optional data to include
   */
  public warn(message: string, data?: any): void {
    const prefix = this.getServicePrefix();
    const formattedMessage = chalk.yellow.bold(message);
    
    if (data !== undefined) {
      const formattedData = chalk.yellow(this.formatValue(data));
      console.warn(prefix, formattedMessage, formattedData);
    } else {
      console.warn(prefix, formattedMessage);
    }
  }

  /**
   * Log an error message
   * @param message The message to log
   * @param error Optional error object or data to include
   */
  public error(message: string, error?: any): void {
    const prefix = this.getServicePrefix();
    const formattedMessage = chalk.red.bold(message);
    
    if (error !== undefined) {
      const formattedError = chalk.red(this.formatValue(error));
      console.error(prefix, formattedMessage, formattedError);
    } else {
      console.error(prefix, formattedMessage);
    }
  }

  /**
   * Log a debug message (only if debug is enabled)
   * @param message The message to log
   * @param data Optional data to include
   */
  public debug(message: string, data?: any): void {
    if (!this.enableDebug) return;
    
    const prefix = this.getServicePrefix();
    const formattedMessage = chalk.magenta(message);
    
    if (data !== undefined) {
      const formattedData = chalk.yellow(this.formatValue(data));
      console.log(prefix, formattedMessage, formattedData);
    } else {
      console.log(prefix, formattedMessage);
    }
  }
}

/**
 * Create a new logger instance
 * @param serviceName The name of the service or module
 * @param enableDebug Whether to enable debug logs
 * @returns A configured Logger instance
 */
export function createLogger(serviceName: string, enableDebug: boolean = false): Logger {
  return new Logger({ serviceName, enableDebug });
}

// Export a default logger for general use
export const logger = createLogger('App');
