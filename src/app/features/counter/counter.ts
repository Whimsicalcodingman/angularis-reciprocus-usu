import { map, Observable, shareReplay, Subscription } from 'rxjs';
import { Memoize } from 'typescript-memoize';

import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { decrement, increment, reset } from './domain/action/counter.actions';
import { CounterState } from './domain/counter.state';

@Component({
  selector: 'app-counter',
  imports: [AsyncPipe],
  templateUrl: './counter.html',
  styleUrl: './counter.scss'
})
export class Counter implements OnInit {
  private readonly store = inject(Store<CounterState>);
  
  private readonly subscription = new Subscription();

  public ngOnInit(): void {
    this.getCount
  }

  private getCount(): void {
    this.subscription.add(
      this.count$.subscribe()
    )
  }

  public increment() {
    this.store.dispatch(increment());
  }

  public decrement() {
    this.store.dispatch(decrement());
  }

  public reset() {
    this.store.dispatch(reset());
  }

  @Memoize() public get count$(): Observable<number> {
    return this.countStateChange$.pipe(
      map((count) => count),
      shareReplay()
    )
  }

  @Memoize() private get countStateChange$(): Observable<number> {
    return this.store.select(state => state.counter);
  }
}