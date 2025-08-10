import { routes } from '#app/app.routes';

import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAppState } from './core/state/app-state.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAppState(),
]
};
