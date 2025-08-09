import './util/tracing'; // must be first import

import { logger } from '@util/logging-util';

import app from './app';

const PORT = process.env.PORT;
app.listen(PORT, () =>
  logger.info(`Server running at http://localhost:${PORT}`)
);
