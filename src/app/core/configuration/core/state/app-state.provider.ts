import { EnvironmentProviders } from '@angular/core';
import { provideStore } from '@ngrx/store';

import { STORE_CONFIG } from './store.config';

export const provideAppState = (): EnvironmentProviders[] => [
  provideStore(STORE_CONFIG)
];