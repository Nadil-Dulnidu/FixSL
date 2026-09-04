export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const MIN_LEVEL: LogLevel = IS_PRODUCTION ? "warn" : "debug";

class Logger {
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[MIN_LEVEL];
  }

  private format(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(context && Object.keys(context).length > 0 ? { context } : {}),
    };
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog("debug")) return;
    const entry = this.format("debug", message, context);
    console.debug(`[DEBUG] \x1b[36m${entry.timestamp}\x1b[0m - \x1b[34m${message}\x1b[0m`, context || "");
  }

  public info(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog("info")) return;
    const entry = this.format("info", message, context);
    console.info(`[INFO] \x1b[36m${entry.timestamp}\x1b[0m - \x1b[32m${message}\x1b[0m`, context || "");
  }

  public warn(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog("warn")) return;
    const entry = this.format("warn", message, context);
    console.warn(`[WARN] \x1b[36m${entry.timestamp}\x1b[0m - \x1b[33m${message}\x1b[0m`, context || "");
  }

  public error(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog("error")) return;
    const entry = this.format("error", message, context);
    console.error(`[ERROR] \x1b[36m${entry.timestamp}\x1b[0m - \x1b[31m${message}\x1b[0m`, context || "");
  }
}

export const logger = new Logger();
