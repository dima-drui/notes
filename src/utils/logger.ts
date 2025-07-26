import { isDev } from '../config';


export const logger = {
  log: (message: string, error: unknown) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'LOG',
      message,
      error,
    };
    console.error(JSON.stringify(logEntry));
  },
  error: (message: string, error: unknown) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      error,
    };
    console.error(JSON.stringify(logEntry));
  },
  debug: (message: string, data?: any) => {
    if (isDev) return
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'DEBUG',
      message,
      ...data,
    };
    console.log(JSON.stringify(logEntry));
  },
};
