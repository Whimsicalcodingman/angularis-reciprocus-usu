import { Routes } from '@angular/router';

import { Temperature } from './features/weather/components/temperature/temperature';
import { Weather } from './features/weather/weather';

export const routes: Routes = [
  {
    path: '',
    component: Weather,
    children: [{ path: '', component: Temperature }],
  },
];
