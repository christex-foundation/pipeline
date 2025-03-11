import { handleErrorWithSentry } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: 'https://a25a9dd442d4a7392fbee35b9ff029f7@o4508959238651904.ingest.us.sentry.io/4508959270502400',
  tracesSampleRate: 1.0,

  integrations: [Sentry.replayIntegration()],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

export const handleError = handleErrorWithSentry();
