interface Logger {
  info: (message: string) => void;
  debug: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
}

const logMessage = (type: string, message: string) => {
  /* eslint-disable no-console */
  console.log(`${type} ${message}`);
};

// Console-based logger
const createLoggerConsole = (): Logger => ({
  info: (message: string) => {
    logMessage('INFO ', message);
  },
  debug: (message: string) => {
    logMessage('DEBUG', message);
  },
  warn: (message: string) => {
    logMessage('WARN ', message);
  },
  error: (message: string) => {
    logMessage('ERROR', message);
  },
});

export const logger: Logger = createLoggerConsole();
