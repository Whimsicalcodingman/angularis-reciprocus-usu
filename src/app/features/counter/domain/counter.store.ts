import { withStorageSync } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type CounterState = {
  counter: number;
};

const initialState: CounterState = {
  counter: 0,
};

export const CounterStore = signalStore(
  withState(initialState),
  withMethods((store) => ({
    increment(): void {
      patchState(store, (state) => ({ counter: state.counter + 1 }));
    },
    decrement(): void {
      patchState(store, (state) => ({ counter: state.counter - 1 }));
    },
    reset(): void {
      patchState(store, { counter: 0 });
    },
  })),
  withStorageSync('count')
);
