import { Component, inject } from '@angular/core';

import { CounterStore } from './domain/counter.store';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.html',
  styleUrl: './counter.scss',
  providers: [CounterStore],
})
export class Counter {
  readonly store = inject(CounterStore);

  increment() {
    this.store.increment();
  }

  decrement() {
    this.store.decrement();
  }

  reset() {
    this.store.reset();
  }
}
