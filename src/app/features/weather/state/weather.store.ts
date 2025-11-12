import { signalStore, withState } from '@ngrx/signals';

import { DailyWeather } from '../domain/weather.model';

type BookSearchState = {
  books: DailyWeather[];
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: BookSearchState = {
  books: [],
  isLoading: false,
  filter: { query: '', order: 'asc' },
};

export const BookSearchStore = signalStore(withState(initialState));
