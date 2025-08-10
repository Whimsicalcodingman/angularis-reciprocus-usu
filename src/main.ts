import { appConfig } from '#app/core/configuration/app.config';

import { bootstrapApplication } from '@angular/platform-browser';

import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
