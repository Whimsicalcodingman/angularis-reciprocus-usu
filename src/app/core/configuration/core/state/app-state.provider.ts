import { Provider } from '@angular/core';
import { provideStore } from '@ngrx/store';

import { STORE_CONFIG } from './store.config';

export const provideAppState = (): Provider => ({
    provide: provideStore,
    useFactory: () => STORE_CONFIG,
    multi: true
})