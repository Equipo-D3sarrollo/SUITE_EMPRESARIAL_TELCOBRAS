import { register } from 'node:module';

/**
 * OpenTelemetry opcional: solo se activa si existe OTEL_EXPORTER_OTLP_ENDPOINT (las demás variables OTEL_*
 * las lee el SDK). Tiene que correr antes de cargar Nest, Fastify, pg e ioredis para poder instrumentarlos,
 * por eso main.ts importa la app después. Devuelve la función que vacía y apaga el SDK.
 */
export async function startTelemetry(): Promise<(() => Promise<void>) | undefined> {
  if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT) return undefined;

  // La API es ESM: este hook intercepta los import para instrumentarlos (los require los cubre el SDK).
  register('@opentelemetry/instrumentation/hook.mjs', import.meta.url);
  const [{ NodeSDK }, { getNodeAutoInstrumentations }, { OTLPTraceExporter }] = await Promise.all([
    import('@opentelemetry/sdk-node'),
    import('@opentelemetry/auto-instrumentations-node'),
    import('@opentelemetry/exporter-trace-otlp-http'),
  ]);
  const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter(),
    // fs genera un span por cada lectura de archivo: ruido sin valor para la API.
    instrumentations: [
      getNodeAutoInstrumentations({ '@opentelemetry/instrumentation-fs': { enabled: false } }),
    ],
  });
  sdk.start();
  return () => sdk.shutdown();
}
