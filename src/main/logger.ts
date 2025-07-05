import * as fs from 'fs';
import * as path from 'path';
import { LogEntry } from '../shared/types';

export class Logger {
  private logs: LogEntry[] = [];
  private logFile: string;
  private maxLogs: number = 1000;

  constructor() {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    this.logFile = path.join(logDir, `app-${new Date().toISOString().split('T')[0]}.log`);
  }

  public log(level: 'info' | 'warn' | 'error', message: string, details?: any): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      details
    };

    this.logs.push(entry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    this.writeToFile(entry);
    
    if (level === 'error') {
      console.error(`[ERROR] ${message}`, details);
    } else if (level === 'warn') {
      console.warn(`[WARN] ${message}`, details);
    } else {
      console.log(`[INFO] ${message}`, details);
    }
  }

  private writeToFile(entry: LogEntry): void {
    try {
      const logLine = `${entry.timestamp.toISOString()} [${entry.level.toUpperCase()}] ${entry.message}${entry.details ? ' ' + JSON.stringify(entry.details) : ''}\\n`;
      fs.appendFileSync(this.logFile, logLine);
    } catch (error) {
      console.error('ログファイル書き込みエラー:', error);
    }
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    this.log('info', 'ログをクリアしました');
  }

  public getLogFile(): string {
    return this.logFile;
  }
}