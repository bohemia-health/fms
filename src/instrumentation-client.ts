import { datadogRum } from "@datadog/browser-rum";
import { reactPlugin } from "@datadog/browser-rum-react";

datadogRum.init({
  applicationId: "1c02fcb4-2f33-4810-a2e0-15575c1898dc",
  clientToken: "pubb1bf9194db742162ee82aa4c38ebed1e",
  site: "datadoghq.com",
  service: "bhm-fms",
  env: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  version: "0.1.0",
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackResources: true,
  trackUserInteractions: true,
  trackLongTasks: true,
  plugins: [reactPlugin({ router: false })],
});
