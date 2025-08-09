import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { B3Propagator } from '@opentelemetry/propagator-b3';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  SimpleSpanProcessor,
  InMemorySpanExporter,
  ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-base';

export const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
  // may need to use other exporter in non local dev
  spanProcessor: new SimpleSpanProcessor(new InMemorySpanExporter()),
  textMapPropagator: new B3Propagator(),
  instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
});

export const shutdown = async () => {
  await sdk.shutdown();
};

export const flush = async () => {
  // access the underlying tracer provider forcibly
  const tracerProvider = (sdk as any)._tracerProvider;
  if (tracerProvider && typeof tracerProvider.forceFlush === 'function') {
    await tracerProvider.forceFlush();
  }
};

sdk.start();
